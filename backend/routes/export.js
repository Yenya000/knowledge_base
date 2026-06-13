const express = require('express');
const router = express.Router();
const db = require('../db');
const PDFDocument = require('pdfkit');
const { Document, Packer, Paragraph, TextRun, HeadingLevel } = require('docx');

// ========== PDF ==========
router.get('/:id/export/pdf', async (req, res) => {
    const { id } = req.params;

    try {
        const result = await db.query(`
            SELECT articles.*, categories.name AS category_name
            FROM articles
            LEFT JOIN categories ON articles.category_id = categories.id
            WHERE articles.id = $1
        `, [id]);

        if (result.rows.length === 0) {
            return res.status(404).json({ error: 'Статья не найдена' });
        }

        const article = result.rows[0];

        res.setHeader('Content-Type', 'application/pdf; charset=utf-8');
        res.setHeader('Content-Disposition', `attachment; filename="article_${article.id}.pdf"`);

        const doc = new PDFDocument({
            font: 'Helvetica',  
            lang: 'ru',
            autoFirstPage: true
        });

        doc.pipe(res);

        // Заголовок
        doc.fontSize(20).text(article.title, { align: 'center' });
        doc.moveDown();

        // Категория
        doc.fontSize(12).text(`Категория: ${article.category_name || 'Без категории'}`);
        doc.moveDown();

        // Содержимое
        doc.fontSize(12).text(article.content || '');

        doc.end();

    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Ошибка генерации PDF' });
    }
});

// ========== Word (DOCX) ==========
router.get('/:id/export/docx', async (req, res) => {
    const { id } = req.params;

    try {
        const result = await db.query(`
            SELECT articles.*, categories.name AS category_name
            FROM articles
            LEFT JOIN categories ON articles.category_id = categories.id
            WHERE articles.id = $1
        `, [id]);

        if (result.rows.length === 0) {
            return res.status(404).json({ error: 'Статья не найдена' });
        }

        const article = result.rows[0];

        const doc = new Document({
            sections: [{
                properties: {},
                children: [
                    new Paragraph({
                        text: article.title,
                        heading: HeadingLevel.TITLE,
                        alignment: 'center'
                    }),
                    new Paragraph({
                        text: `Категория: ${article.category_name || 'Без категории'}`,
                        alignment: 'left'
                    }),
                    new Paragraph({ text: '' }),
                    new Paragraph({
                        children: [
                            new TextRun({
                                text: article.content || '',
                                font: "Arial",
                                size: 24
                            })
                        ]
                    })
                ]
            }]
        });

        const buffer = await Packer.toBuffer(doc);
        res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document; charset=utf-8');
        res.setHeader('Content-Disposition', `attachment; filename="article_${article.id}.docx"`);
        res.send(buffer);

    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Ошибка генерации DOCX' });
    }
});

module.exports = router;