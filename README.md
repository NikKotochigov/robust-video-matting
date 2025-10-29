# Robust Video Matting - React App

Приложение для реального времени видеосегментации с использованием TensorFlow.js и React. Позволяет выделять объекты переднего плана из видеопотока и заменять фон в браузере.

![Video Segmentation Demo](https://img.shields.io/badge/demo-video%20segmentation-brightgreen)
![React](https://img.shields.io/badge/React-18-blue)
![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue)
![TensorFlow.js](https://img.shields.io/badge/TensorFlow.js-3.7-orange)

## 🚀 Возможности

- **Реальное время видеосегментация** с помощью веб-камеры
- **Замена фона** на различные варианты (белый, зеленый, прозрачный)
- **Рекуррентная архитектура** для временной консистентности
- **Визуализация скрытых состояний** RNN модели
- **Оптимизированная производительность** с GPU ускорением
- **Feature-Sliced Design** архитектура

## 🛠 Технологический стек

- **React 18** + **TypeScript** - пользовательский интерфейс
- **TensorFlow.js 3.7** - машинное обучение в браузере
- **Vite 5** - быстрая сборка и разработка
- **CSS Modules** - модульная стилизация
- **WebRTC** - захват видео с камеры

## 📦 Установка

### Предварительные требования

- Node.js 18+ 
- npm или yarn
- Современный браузер с поддержкой WebRTC и WebGL

### Клонирование и установка зависимостей

```bash
git clone https://github.com/NikKotochigov/robust-video-matting.git
cd robust-video-matting
npm install
```

### Подготовка модели

Поместите файлы модели TensorFlow.js в папку `public/model/`:
```
public/
└── model/
    ├── model.json
    └── model_weights.bin (или разделенные файлы весов)
```

**Примечание**: Модель должна быть совместима с форматом TensorFlow.js и иметь следующие входы/выходы:
- Входы: `src`, `r1i`, `r2i`, `r3i`, `r4i`, `downsample_ratio`
- Выходы: `fgr`, `pha`, `r1o`, `r2o`, `r3o`, `r4o`

## 🚦 Запуск

### Режим разработки

```bash
npm run dev
```

Приложение будет доступно по адресу: `http://localhost:3000`

### Сборка для продакшена

```bash
npm run build
npm run preview
```

## 🎯 Использование

1. **Откройте приложение** в браузере
2. **Разрешите доступ к камере** при появлении запроса
3. **Выберите режим отображения**:
   - `White Background` - белый фон
   - `Green Background` - зеленый фон (хромакей)
   - `Alpha` - альфа-канал (маска сегментации)
   - `Foreground` - только передний план
   - `Recurrent State 1-4` - скрытые состояния RNN
4. **Наблюдайте** за сегментацией в реальном времени

## 🏗 Архитектура проекта

Проект следует методологии **Feature-Sliced Design (FSD)**:

```
src/
├── app/           # Конфигурация приложения
│   ├── App.tsx
│   └── index.ts
├── pages/         # Страницы
│   └── segmentation/
├── widgets/       # Виджеты UI
│   └── video-segmentation/
├── features/      # Бизнес-функции
│   └── background-selector/
├── entities/      # Сущности предметной области
│   └── segmentation/
└── shared/        # Общие ресурсы
    ├── ui/        # UI компоненты
    ├── lib/       # Утилиты
    └── config/    # Конфигурация
```

## ⚙️ Конфигурация

Основные параметры находятся в `src/shared/config/constants.ts`:

```typescript
export const SEGMENTATION_CONFIG = {
    VIDEO_WIDTH: 640,           // Ширина видео
    VIDEO_HEIGHT: 480,          // Высота видео
    DOWNSAMPLE_RATIO: 0.5,      // Коэффициент масштабирования
    MODEL_PATH: '/model/model.json', // Путь к модели
} as const;
```

## 🔧 Разработка

### Структура компонентов

- **VideoSegmentationWidget** - основной виджет сегментации
- **BackgroundSelector** - селектор режимов отображения
- **Video/Canvas** - базовые UI компоненты

### Ключевые функции

- `loadSegmentationModel()` - загрузка TF.js модели
- `performInference()` - выполнение инференса
- `drawMatte()` / `drawHidden()` - отрисовка результатов

### Управление памятью

Приложение автоматически управляет GPU памятью:
- Освобождает тензоры после использования
- Корректно завершает WebRTC стримы
- Отменяет animation frames

## 🐛 Отладка

### Частые проблемы

1. **Модель не загружается**
   - Проверьте путь к файлам модели в `public/model/`
   - Убедитесь, что формат совместим с TensorFlow.js

2. **Низкая производительность**
   - Проверьте поддержку WebGL в браузере
   - Уменьшите `DOWNSAMPLE_RATIO` в конфигурации

3. **Камера не работает**
   - Разрешите доступ к камере в браузере
   - Проверьте HTTPS соединение (требуется для WebRTC)

### Логирование

Включите детальные логи в консоли браузера для отладки процесса инференса.

## 🤝 Вклад в разработку

1. Fork репозитория
2. Создайте feature branch (`git checkout -b feature/amazing-feature`)
3. Commit изменения (`git commit -m 'Add amazing feature'`)
4. Push в branch (`git push origin feature/amazing-feature`)
5. Откройте Pull Request

## 📄 Лицензия

Этот проект распространяется под лицензией MIT. См. файл `LICENSE` для подробностей.

## 🔗 Связанные проекты

- [RobustVideoMatting](https://github.com/PeterL1n/RobustVideoMatting) - оригинальная PyTorch реализация
- [TensorFlow.js](https://www.tensorflow.org/js) - машинное обучение в браузере
- [Feature-Sliced Design](https://feature-sliced.design/) - архитектурная методология

## 📞 Контакты

**Nikolay Kotochigov** - [@NikKotochigov](https://github.com/NikKotochigov)

Ссылка на проект: [https://github.com/NikKotochigov/robust-video-matting](https://github.com/NikKotochigov/robust-video-matting)