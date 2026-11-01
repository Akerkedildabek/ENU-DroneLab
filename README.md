# ENU DroneLab

**Пилотсыз авиациялық жүйелер операторы (1-санат)** курсына арналған интерактивті қазақтілді сайт.

React + TypeScript + Vite + Tailwind CSS + Three.js / React Three Fiber + Drei + Framer Motion.

## Құрамында не бар?

- Толығымен ақ стильдегі, телефонға бейімделетін үш бөлімді басты бет.
- **Нақты 3D:** үш процедуралық квадрокоптер, айналатын винттер, қозғалыстың жеке жұмсақ траекториялары. Сыртқы GLB файлдары қажет емес.
- 10 жұмыс істейтін дәріс беті (`#/lecture/01` және т.б.).
- Бірінші дәрісте айналдырып қарауға, үлкейтуге және винт жылдамдығын өзгертуге болатын интерактивті 3D зертхана.
- PDF алдын ала көрсету, PPTX жүктеу, MP4 видео, YouTube, GLB/GLTF, сыртқы турлар мен ресурстар.
- Мазмұн `public/data/lectures.json` файлынан оқылады, React кодын өңдеу талап етілмейді.
- GitHub Pages арқылы автоматты жариялауға арналған GitHub Actions.

## Компьютерде іске қосу

[Node.js](https://nodejs.org/) 20.19+ немесе 22.12+ нұсқасы қажет.

```bash
npm install
npm run dev
```

Терминал көрсеткен жергілікті сілтемені браузерде ашыңыз (әдетте `http://localhost:5173`).

```bash
npm run build
npm run preview
```

## GitHub Pages-ке жариялау

1. GitHub жүйесінде `ENU-DroneLab` атауымен жаңа **public** repository ашыңыз.
2. Осы жобаның **ішіндегі барлық файлды**, оның ішінде `.github/workflows/deploy.yml` файлын, репозиторийдің түбіріне жүктеңіз. `.github` қалтасын өткізіп алмаңыз.
3. Файлдарды `main` тармағына сақтаңыз (commit/push).
4. Репозиторийдегі **Settings → Pages → Build and deployment → Source → GitHub Actions** таңдаңыз.
5. **Actions** қойындысында `Deploy ENU DroneLab to GitHub Pages` жұмысын тексеріңіз.
6. Сайттың сілтемесі: `https://USERNAME.github.io/ENU-DroneLab/`.

GitHub Actions автоматты түрде репозиторий атауын Vite `base` мекенжайына қояды. Басқа субқалта қажет болса, `VITE_BASE_PATH` орталық айнымалысын беріңіз (мысалы `/my-repo/`).

**Маршрутизация:** `HashRouter` пайдаланылғандықтан `#/lecture/01` тікелей ашылады және браузерді жаңартқанда 404 қатесі шықпайды.

## Дәріс материалдарын кейін қосу

Әр дәріске арналған каталог:

```text
public/content/lecture-01/
public/content/lecture-02/
...
public/content/lecture-10/
```

### Мысал: 1-дәріске PDF, PPTX, MP4 және 3D қосу

1. Файлдарды тиісті қалтаға салыңыз:

```text
public/content/lecture-01/presentation.pdf
public/content/lecture-01/slides.pptx
public/content/lecture-01/intro.mp4
public/content/lecture-01/quadcopter.glb
public/content/lecture-01/task.pdf
```

2. `public/data/lectures.json` ашып, бірінші дәрістің `materials` объектісіне мына деректерді енгізіңіз:

```json
"materials": {
  "presentations": [
    {"title": "Кіріспе дәрісі (PDF)", "type": "pdf", "path": "content/lecture-01/presentation.pdf"},
    {"title": "PowerPoint слайдтары", "type": "pptx", "path": "content/lecture-01/slides.pptx"}
  ],
  "videos": [
    {"title": "Кіріспе бейнесі", "type": "mp4", "path": "content/lecture-01/intro.mp4"},
    {"title": "YouTube дәрісі", "type": "youtube", "url": "https://www.youtube.com/watch?v=YOUR_VIDEO_ID"}
  ],
  "models": [
    {"title": "Квадрокоптердің 3D моделі", "type": "glb", "path": "content/lecture-01/quadcopter.glb"}
  ],
  "virtualTours": [
    {"title": "Виртуалды тур", "type": "link", "url": "https://example.org/your-tour", "embeddable": false}
  ],
  "practices": [
    {"title": "Практикалық тапсырма", "type": "pdf", "path": "content/lecture-01/task.pdf"}
  ],
  "additional": [
    {"title": "Қосымша материал", "type": "link", "url": "https://example.org"}
  ]
}
```

**Ескерту:** бұл JSON блогы тек нұсқаулықтағы мысал. `lectures.json` ішінде бастапқы материалдар тізімі бос; жоқ файлға жалған сілтеме жасалмайды. Файлды шынымен орналастырмайынша мысалдағы жолдарды сайтқа енгізбеңіз.

3. Өзгерістерді GitHub-қа жүктеңіз. Actions автоматты қайта жариялайды. Дәріс дизайны өзгермейді.

### Сыртқы турды кірістіру

Егер сыртқы сайт iframe арқылы көрсетуді қолдаса, `"embeddable": true` деп өзгертіңіз. Қолдамаса, материал сыртқы сілтеме ретінде ашылады. Сыртқы сайттың қауіпсіздік саясатын біздің сайт өзгерте алмайды.

### PDF, PPTX, видео және 3D модель

- PDF браузерде iframe арқылы көрсетіледі; жеке ашу сілтемесі де бар.
- PPTX ашып оқудың орнына жүктеуге арналған (PDF баламасын бөлек қосуға болады).
- MP4 HTML5 бейне ойнатқышында, YouTube embed ойнатқышында көрінеді.
- GLB/GLTF Three.js жүктегішімен автоматты масштабталып көрсетіледі. **GLB** таңдаған ыңғайлы, себебі текстуралар бір файлда сақталады.
- Үлкен MP4 модельдер GitHub репозиторийі шектеулеріне ұшырауы мүмкін. Ондайда видеоны YouTube-қа жүктеп, сілтемені JSON-ға қосыңыз.

## Байланыс мәліметін өзгерту

`public/data/lectures.json` ішінде `contactEmail` өрісіне өзіңіздің поштаңызды қойыңыз. Университет атауы `university` өрісінде.

## Жоба құрылымы

```text
ENU-DroneLab/
├─ .github/workflows/deploy.yml
├─ public/
│  ├─ data/lectures.json
│  └─ content/lecture-01/ ... lecture-10/
├─ src/
│  ├─ components/
│  │  ├─ layout/Header.tsx
│  │  ├─ scene/DroneModel.tsx
│  │  ├─ scene/HeroDroneScene.tsx
│  │  ├─ scene/DroneLabPreview.tsx
│  │  ├─ lectures/LectureCard.tsx
│  │  └─ viewers/{ModelViewer,MaterialSections}.tsx
│  ├─ hooks/
│  ├─ lib/assets.ts
│  ├─ pages/{HomePage,LecturePage}.tsx
│  ├─ types/lecture.ts
│  ├─ App.tsx
│  ├─ main.tsx
│  └─ styles.css
├─ index.html
├─ vite.config.ts
├─ package.json
└─ README.md
```

## 3D және өнімділік

- Қозғалатын квадрокоптерлер Three.js геометрияларынан жасалған, видео да, CSS-анимация да емес.
- Hero 3D аймағы экраннан кеткенде оның кадр циклі тоқтайды; қозғалысы азайтылған режимде анимация шектеледі.
- WebGL істемейтін құрылғыларда жай түсіндірме көрінеді.
- Бұл оқу демонстрациясы, ұшу аппаратын сертификаттауға немесе физикалық дәл инженерлік есепке арналмаған.

## Лицензия

Жоба коды: MIT. Өздеріңіз жүктейтін сыртқы материалдардың авторлық құқығын өзіңіз тексеріңіз. ENU атауы мен логотипінің ресми қолданылуын университет ережелері бойынша келісіңіз; жоба әзірге жеке бренд белгісін қолданады.
