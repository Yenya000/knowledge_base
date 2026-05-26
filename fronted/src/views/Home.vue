<template>
  <div class="min-h-screen bg-ob-base text-ob-text">

    <!-- Шапка -->
    <header class="fixed top-0 left-0 right-0 z-50 backdrop-blur-md bg-ob-base/80 border-b border-ob-border h-14">
      <div class="max-w-7xl mx-auto px-6 flex items-center justify-between h-full">
        
        <!-- Логотип -->
        <div class="flex gap-3 items-center">
          <div class="w-6 h-6 bg-ob-accent" style="clip-path: polygon(50% 0%,85% 15%,100% 50%,85% 85%,50% 100%,15% 85%,0% 50%,15% 15%)"></div>
          <span class="font-bold">OBLIVIONE</span>
          <span class="font-bold text-ob-accent">|</span>
          <span class="font-bold">BASE</span>
        </div>

        <!-- Навигация -->
        <nav class="hidden md:flex gap-8">
          <RouterLink to="/" class="text-sm text-ob-accent">База знаний</RouterLink>
          <RouterLink to="/" class="text-sm text-ob-muted hover:text-ob-text transition-all duration-200">Регламенты</RouterLink>
          <RouterLink to="/" class="text-sm text-ob-muted hover:text-ob-text transition-all duration-200">FAQ</RouterLink>
          <RouterLink to="/" class="text-sm text-ob-muted hover:text-ob-text transition-all duration-200">Шаблоны</RouterLink>
        </nav>

        <!-- Кнопки -->
        <div class="flex items-center gap-3">
          <button class="border border-ob-accent text-ob-accent hover:bg-ob-accent hover:text-ob-base transition-all duration-200 text-sm font-bold px-4 py-1.5 rounded">Войти</button>
          <button class="bg-ob-accent text-ob-base hover:opacity-90 transition-all duration-200 text-sm font-bold px-4 py-1.5 rounded">Мой кабинет</button>
        </div>
      </div>
    </header>

    <main class="pt-14">
      <section class="px-6 py-20 max-w-7xl mx-auto">

        <!-- Заголовок -->
        <div class="mb-8">
          <p class="font-mono uppercase tracking-widest text-xs text-ob-accent mb-3">// KNOWLEDGE BASE - OBLIVIONE GROUP</p>
          <h1 class="text-4xl font-extrabold leading-tight mb-3">
            Всё, что нужно <br>знать –
            <span class="text-ob-accent">здесь</span>
          </h1>
          <p class="text-sm text-ob-muted">Инструкции, регламенты, шаблоны и документация компании</p>
        </div>

        <!-- Поисковая строка -->
        <div class="flex items-center border border-ob-border bg-ob-surface rounded-lg px-4 h-11 max-w-lg">
          <input type="text" class="!border-0 !bg-transparent !p-0 outline-none flex-1 text-sm text-ob-text placeholder:text-ob-muted" placeholder="Поиск по базе знаний...">
          <span class="text-xs text-ob-muted font-mono border border-ob-border px-2 rounded">⌘K</span>
        </div>

        <!-- Теги -->
        <div class="flex gap-2 mt-6 flex-wrap">
          <button class="text-xs px-3 py-1 rounded-full border border-ob-accent text-ob-accent bg-ob-accent/10">Все</button>
          <button class="text-xs px-3 py-1 rounded-full border border-ob-border text-ob-muted hover:border-ob-accent hover:text-ob-accent transition-all duration-200">IT</button>
          <button class="text-xs px-3 py-1 rounded-full border border-ob-border text-ob-muted hover:border-ob-accent hover:text-ob-accent transition-all duration-200">HR</button>
          <button class="text-xs px-3 py-1 rounded-full border border-ob-border text-ob-muted hover:border-ob-accent hover:text-ob-accent transition-all duration-200">Финансы</button>
          <button class="text-xs px-3 py-1 rounded-full border border-ob-border text-ob-muted hover:border-ob-accent hover:text-ob-accent transition-all duration-200">Маркетинг</button>
          <button class="text-xs px-3 py-1 rounded-full border border-ob-border text-ob-muted hover:border-ob-accent hover:text-ob-accent transition-all duration-200">Юридический</button>
        </div>

        <!-- Статистика -->
        <div class="flex gap-6 mt-8 pb-6 border-b border-ob-border font-mono text-xs text-ob-muted">
          <div><span class="text-ob-accent font-bold">142</span> статьи</div>
          <div><span class="text-ob-accent font-bold">8</span> разделов</div>
          <div><span class="text-ob-accent font-bold">12</span> обновлено за неделю</div>
        </div>

        <!-- Карточки -->
        <div class="grid mt-8 grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-px bg-ob-border">
          
          <!-- Карточка 1 -->
          <div class="bg-ob-surface p-5 hover:bg-ob-surface/80 transition-all duration-200 flex flex-col">
            <div class="text-xs font-mono text-ob-accent uppercase tracking-widest mb-2">IT</div>
            <h3 class="text-base font-semibold text-ob-text mb-2">Настройка рабочего окружения</h3>
            <p class="text-sm text-ob-muted leading-relaxed mb-4 flex-1">Инструкция по установке ПО, VPN и доступа к корпоративным ресурсам</p>
            <div class="flex justify-between items-center">
              <div class="flex items-center gap-1">
                <span class="w-1.5 h-1.5 rounded-full bg-ob-accent opacity-50 inline-block"></span>
                <span class="text-xs text-ob-muted font-mono">2 дня назад</span>
              </div>
              <span class="text-ob-accent text-sm">→</span>
            </div>
          </div>

          <!-- Карточка 2 -->
          <div class="bg-ob-surface p-5 hover:bg-ob-surface/80 transition-all duration-200 flex flex-col">
            <div class="text-xs font-mono text-ob-accent uppercase tracking-widest mb-2">HR</div>
            <h3 class="text-base font-semibold text-ob-text mb-2">Регламент отпусков и больничных</h3>
            <p class="text-sm text-ob-muted leading-relaxed mb-4 flex-1">Порядок оформления, сроки подачи заявок и необходимые документы</p>
            <div class="flex justify-between items-center">
              <div class="flex items-center gap-1">
                <span class="w-1.5 h-1.5 rounded-full bg-ob-accent opacity-50 inline-block"></span>
                <span class="text-xs text-ob-muted font-mono">5 дней назад</span>
              </div>
              <span class="text-ob-accent text-sm">→</span>
            </div>
          </div>

          <!-- Карточка 3 -->
          <div class="bg-ob-surface p-5 hover:bg-ob-surface/80 transition-all duration-200 flex flex-col">
            <div class="text-xs font-mono text-ob-accent uppercase tracking-widest mb-2">МАРКЕТИНГ</div>
            <h3 class="text-base font-semibold text-ob-text mb-2">Гайдлайн бренда Oblivione</h3>
            <p class="text-sm text-ob-muted leading-relaxed mb-4 flex-1">Логотипы, шрифты, цвета и правила использования фирменного стиля</p>
            <div class="flex justify-between items-center">
              <div class="flex items-center gap-1">
                <span class="w-1.5 h-1.5 rounded-full bg-ob-accent opacity-50 inline-block"></span>
                <span class="text-xs text-ob-muted font-mono">3 дня назад</span>
              </div>
              <span class="text-ob-accent text-sm">→</span>
            </div>
          </div>

          <!-- Карточка  4-->
          <div class="bg-ob-surface p-5 hover:bg-ob-surface/80 transition-all duration-200 flex flex-col">
            <div class="text-xs font-mono text-ob-accent uppercase tracking-widest mb-2">IT</div>
            <h3 class="text-base font-semibold text-ob-text mb-2">API внутренних сервисов</h3>
            <p class="text-sm text-ob-muted leading-relaxed mb-4 flex-1">Документация по эндпоинтам, авторизации и rate-limit политике</p>
            <div class="flex justify-between items-center">
              <div class="flex items-center gap-1">
                <span class="w-1.5 h-1.5 rounded-full bg-ob-accent opacity-50 inline-block"></span>
                <span class="text-xs text-ob-muted font-mono">сегодня</span>
              </div>
              <span class="text-ob-accent text-sm">→</span>
            </div>
          </div>

          <!-- Карточка 5 -->
          <div class="bg-ob-surface p-5 hover:bg-ob-surface/80 transition-all duration-200 flex flex-col">
            <div class="text-xs font-mono text-ob-accent uppercase tracking-widest mb-2">ФИНАНСЫ</div>
            <h3 class="text-base font-semibold text-ob-text mb-2">Авансовый отчёт: шаблон и правила</h3>
            <p class="text-sm text-ob-muted leading-relaxed mb-4 flex-1">Как заполнить авансовый отчёт, сроки сдачи и примеры оформления</p>
            <div class="flex justify-between items-center">
              <div class="flex items-center gap-1">
                <span class="w-1.5 h-1.5 rounded-full bg-ob-accent opacity-50 inline-block"></span>
                <span class="text-xs text-ob-muted font-mono">1 неделю назад</span>
              </div>
              <span class="text-ob-accent text-sm">→</span>
            </div>
          </div>

          <!-- Карточка 6 -->
          <div class="bg-ob-surface p-5 hover:bg-ob-surface/80 transition-all duration-200 flex flex-col">
            <div class="text-xs font-mono text-ob-accent uppercase tracking-widest mb-2">HR</div>
            <h3 class="text-base font-semibold text-ob-text mb-2">Онбординг нового сотрудника</h3>
            <p class="text-sm text-ob-muted leading-relaxed mb-4 flex-1">Чек-лист первого дня, доступы, знакомство с командой и процессами</p>
            <div class="flex justify-between items-center">
              <div class="flex items-center gap-1">
                <span class="w-1.5 h-1.5 rounded-full bg-ob-accent opacity-50 inline-block"></span>
                <span class="text-xs text-ob-muted font-mono">4 дня назад</span>
              </div>
              <span class="text-ob-accent text-sm">→</span>
            </div>
          </div>

        </div>
      </section>
    </main>

    <footer class="border-t border-ob-border mt-auto">
  <div class="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
    
    <div class="flex items-center gap-3">
      <span class="text-xs text-ob-muted font-mono">© 2026 Oblivione Group</span>
    </div>

    <div class="flex items-center gap-6">
      <RouterLink href="#" class="text-xs text-ob-muted hover:text-ob-text transition-all duration-200">Политика</RouterLink>
      <RouterLink href="#" class="text-xs text-ob-muted hover:text-ob-text transition-all duration-200">Контакты</RouterLink>
      <RouterLink href="#" class="text-xs text-ob-muted hover:text-ob-text transition-all duration-200">Docs</RouterLink>
    </div>

  </div>
</footer>

  </div>
</template>