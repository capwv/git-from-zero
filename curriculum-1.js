/* Curriculum part 1: intro, setup, first repo, history, branches, merging, conflicts */
var CURRICULUM = window.CURRICULUM || [];
CURRICULUM.push(
{
  id: 'intro',
  nav: 'ليه Git أصلاً؟',
  title: 'ليه Git أصلاً؟ Version Control من الصفر',
  subtitle: 'المشكلة اللي Git بيحلها، وإزاي بيفكر، وليه كل الناس بتستخدمه',
  blocks: [
    { type: 'p', text: 'تخيل إنك شغال على مشروع وبتسمي الملفات كده: `report.docx`، بعدين `report-final.docx`، بعدين `report-final2.docx`، وفي الآخر `report-FINAL-الحقيقي.docx`. كل نسخة ماشية، بس بعد أسبوع مش فاكر فين النسخة الصح، ومين عدل إيه، وإزاي ترجع لنسخة قديمة. دي بالظبط المشكلة اللي بيحلها الـ Version Control.' },
    { type: 'p', text: 'نظام الـ Version Control (نظام إدارة النسخ) بيسجل كل تعديل بتحفظه في المشروع: مين عمله، إمتى، وليه. وفي أي لحظة تقدر ترجع لأي نسخة قديمة، تقارن بين نسختين، وتشتغل على ميزة جديدة من غير ما تبوظ الشغل الشغال.' },
    { type: 'h', text: 'Git مش GitHub' },
    { type: 'p', text: 'نقطة بتلخبط ناس كتير: `Git` هو البرنامج نفسه، بيشتغل على جهازك وبيحفظ تاريخ المشروع في فولدر مخفي اسمه `.git`. أما `GitHub` فهو موقع بيستضيف الـ repos بتاعتك أونلاين عشان تشاركها وتشتغل مع ناس. Git من غير GitHub شغال عادي، وGitHub من غير Git ملوش لازمة.' },
    { type: 'table', head: ['Git', 'GitHub'], rows: [
      ['برنامج على جهازك', 'موقع ومنصة أونلاين'],
      ['بيحفظ تاريخ النسخ محلياً', 'بيستضيف الـ repos ويشاركها'],
      ['بيشتغل من غير إنترنت', 'محتاج إنترنت'],
      ['مجاني ومفتوح المصدر', 'خدمة (فيها خطة مجانية سخية)']
    ] },
    { type: 'h', text: 'الفكرة الأساسية: snapshots مش نسخ ملفات' },
    { type: 'p', text: 'كل ما "تحفظ" في Git (وده اسمه `commit`)، Git بياخد snapshot (لقطة) للمشروع كله في اللحظة دي ويخزنها. اللقطات دي متسلسلة، وكل لقطة عارفة اللي قبلها. عشان كده الرجوع لأي نقطة في التاريخ سهل وسريع.' },
    { type: 'p', text: 'كل commit ليه رسالة بتوصف التعديل، ومعاد، واسم اللي عمله، ورقم فريد (hash) زي `0b603ac`. الرقم ده هو عنوان اللقطة، وهتشوفه في كل حتة.' },
    { type: 'note', text: 'ليه بنتعلم Git في أكاديمية تحليل بيانات؟ لأن أي شغل حقيقي: أكواد تحليل، notebooks، تقارير، dashboards، محفوظة على Git ومتشاركة على GitHub. وكل أكاديمياتنا نفسها منشورة بـ GitHub Pages، والمشروع الختامي هنا هيعلمك تنشر مشروعك بنفس الطريقة.' },
    { type: 'h', text: 'الرحلة اللي جاية' },
    { type: 'list', items: [
      'هتثبت Git وتظبطه على جهازك (أو تتمرن في المعمل هنا لو لسه).',
      'هتتعلم دورة الشغل الأساسية: تعديل ← add ← commit.',
      'هتشتغل بالـ branches وتدمجها وتحل الـ conflicts.',
      'هتربط شغلك بـ GitHub: push و pull و Pull Requests.',
      'في الآخر: هتنشر أول مشروع ليك على GitHub Pages زي الأكاديمية دي بالظبط.'
    ] }
  ],
  quiz: [
    { q: 'إيه المشكلة الأساسية اللي الـ Version Control بيحلها؟', options: [
      { text: 'تسريع الكمبيوتر وتقليل استهلاك الذاكرة وقت الشغل على مشاريع كبيرة' },
      { text: 'تتبع كل تعديل: مين عمله وإمتى، والرجوع لأي نسخة قديمة' },
      { text: 'ضغط الملفات عشان توفر مساحة التخزين وتنقلها أسرع بين الأجهزة' }
    ], answer: 1, explain: 'الـ Version Control بيسجل تاريخ التعديلات كله، فتقدر ترجع لأي نقطة وتقارن بين النسخ وتشتغل مع ناس من غير لخبطة.' },
    { q: 'إيه الفرق بين Git و GitHub؟', options: [
      { text: 'مفيش فرق عملي، دول اسمين مختلفين لنفس البرنامج بنفس الوظايف' },
      { text: 'Git برنامج على جهازك لإدارة النسخ، و GitHub موقع بيستضيف الـ repos أونلاين' },
      { text: 'Git موقع بيستضيف المشاريع على الإنترنت، و GitHub برنامج بيتسطب على جهازك' }
    ], answer: 1, explain: 'Git أداة محلية، GitHub استضافة ومنصة تعاون. تقدر تستخدم Git لوحدك من غير إنترنت خالص.' },
    { q: 'الـ commit في Git بيمثل إيه؟', options: [
      { text: 'رسالة بتتبعت للفريق كله عشان تعرفهم إنك خلصت تعديل في المشروع' },
      { text: 'نسخة مضغوطة من ملف واحد بس بتتحفظ جنب الملف الأصلي في نفس الفولدر' },
      { text: 'لقطة (snapshot) للمشروع في لحظة معينة، ليها رسالة ومعاد ورقم فريد' }
    ], answer: 2, explain: 'كل commit هو snapshot كاملة للمشروع، مربوطة باللي قبلها، وليها hash فريد زي 0b603ac.' }
  ],
  exercises: [
    { task: 'اكتب بإيدك (أو في ورقة) 3 مواقف من شغلك أو دراستك كان الـ Version Control هيوفر فيها عليك وجع دماغ', code: `# أمثلة متوقعة (مفيش إجابة نموذجية واحدة):
# 1. ملف إكسل "final_v3_الحقيقي.xlsx" ومحدش فاكر أنهي نسخة صح
# 2. سكريبت تحليل اتعدل وبقى بيدي نتايج غلط وعايز ترجع للنسخة الشغالة
# 3. شغل جماعي: اتنين عدلوا نفس التقرير وضاعت تعديلات واحد فيهم`, why: 'الهدف إنك تحس بالمشكلة قبل ما تتعلم الأداة. أي موقف فيه نسخ كتير أو شغل جماعي أو رغبة في الرجوع لنسخة قديمة هو موقف Git بيتألق فيه.' },
    { task: 'افتح معمل Git من الشريط فوق واكتب `help` وشوف الأوامر المتاحة. جرب كمان `echo "تجربة" > test.txt` وبعدين `cat test.txt`', code: `$ echo "تجربة" > test.txt
$ cat test.txt
تجربة
$ ls
test.txt`, why: 'المعمل بيحاكي ترمنال حقيقي: echo بيكتب ملفات و cat بيطبعها. العلاقة دي (ملفات + أوامر) هي أرضية كل اللي جاي.' }
  ]
},
{
  id: 'setup',
  nav: 'التثبيت والإعداد',
  title: 'تثبيت Git وإعداده على جهازك',
  subtitle: 'Install على أي نظام، وأول أمرين لازم تشغلهم قبل أي حاجة',
  blocks: [
    { type: 'p', text: 'قبل ما نكتب أي أمر، نتأكد إن Git متسطب عندك. التثبيت بياخد دقايق، وبيحصل مرة واحدة في عمر الجهاز.' },
    { type: 'h', text: 'التثبيت حسب نظامك' },
    { type: 'list', items: [
      'Windows: نزل المتسبت الرسمي من git-scm.com/download/win ودوس Next على كل حاجة. الاختيارات الافتراضية كويسة. بعد التثبيت هتلاقي برنامج اسمه Git Bash، ده الترمنال اللي هنشتغل عليه.',
      'macOS: افتح Terminal واكتب git --version، لو مش متسطب هيطلب منك تثبت أدوات Xcode (وافق). أو من Homebrew: brew install git.',
      'Linux (Ubuntu/Debian): sudo apt update && sudo apt install git'
    ] },
    { type: 'code', code: `$ git --version
git version 2.34.1` },
    { type: 'p', text: 'لو ظهر رقم نسخة، يبقى Git شغال. الرقم نفسه مش مهم، أي نسخة من آخر خمس سنين هتشتغل معاك بنفس الأوامر.' },
    { type: 'h', text: 'أهم خطوة: عرّف Git مين انت' },
    { type: 'p', text: 'كل commit بيتمضي باسم وإيميل اللي عمله. من غيرهم Git هيرفض يعمل commit. ظبطهم مرة واحدة كده:' },
    { type: 'code', code: `$ git config --global user.name "Ahmed Wael"
$ git config --global user.email "ahmed@example.com"

# اتأكد إنهم اتسجلوا:
$ git config --list
user.name=Ahmed Wael
user.email=ahmed@example.com
init.defaultbranch=main` },
    { type: 'p', text: '`--global` معناها "لكل المشاريع على الجهاز ده". من غيرها الإعداد بيتطبق على الـ repo الحالية بس. الاسم والإيميل دول اللي هيظهروا على commits بتاعتك على GitHub، فاكتبهم صح (الإيميل الأفضل يكون نفس إيميل حساب GitHub).' },
    { type: 'h', text: 'إعداد تالت يستاهل: اسم البرانش الافتراضي' },
    { type: 'code', code: `$ git config --global init.defaultBranch main` },
    { type: 'p', text: 'النسخ القديمة من Git كانت بتسمي البرانش الافتراضي `master`، والجديدة و GitHub بيستخدموا `main`. السطر ده بيخلي أي repo جديدة تبدأ بـ main عشان متلقبطش بين اسمين.' },
    { type: 'note', text: 'لسه مثبتش Git على جهازك؟ متقلقش: معمل Git التفاعلي هنا في الموقع بيحاكي كل الأوامر اللي هنتعلمها. كمل الدروس وتمرن في المعمل، وثبت Git على جهازك في أي وقت.' },
    { type: 'p', text: 'عايز محرر نصوص كويس جنب Git؟ أشهر اختيار هو VS Code، وفيه تكامل مدمج مع Git (علامة الـ branch في الشريط اللي تحت، وألوان للملفات المتعدلة). مش شرط دلوقتي، بس هيريحك جداً بعدين.' }
  ],
  quiz: [
    { q: 'إزاي تتأكد إن Git اتسطب صح؟', options: [
      { text: 'git --version', mono: true },
      { text: 'git install', mono: true },
      { text: 'git start', mono: true }
    ], answer: 0, explain: 'git --version بيطبع رقم النسخة. الأمرين التانيين مش موجودين في Git أصلاً.' },
    { q: 'ليه بنعمل git config --global user.name و user.email؟', options: [
      { text: 'عشان GitHub يبعتلك إيميلات تنبيه بكل تعديل بيحصل على المشروع' },
      { text: 'عشان كل commit يتمضي باسمك وإيميلك، وGit مش هيعمل commit من غيرهم' },
      { text: 'عشان نسرّع عملية الـ push ونتجنب كتابة الباسورد كل مرة' }
    ], answer: 1, explain: 'الهوية دي جزء من كل commit. Git بيرفض يعمل commit من غير ما يعرف مين انت، عشان تاريخ المشروع يفضل دقيق.' },
    { q: 'كلمة --global في git config معناها إيه؟', options: [
      { text: 'الإعداد يتطبق على كل المشاريع على الجهاز ده' },
      { text: 'الإعداد يترفع على الإنترنت ويتشارك مع كل اللي بيشتغلوا معاك' },
      { text: 'الإعداد يتطبق على الـ repo الحالية بس وميأثرش على أي مشروع تاني' }
    ], answer: 0, explain: 'global = مستوى المستخدم كله على الجهاز. من غيرها الإعداد محلي للـ repo الحالية بس.' }
  ],
  exercises: [
    { task: 'ثبت Git على جهازك (أو افتح المعمل) وشغل الأوامر دي بالترتيب: التحقق من النسخة، ضبط الاسم والإيميل، وطباعة الإعدادات', code: `$ git --version
git version 2.34.1

$ git config --global user.name "اسمك الحقيقي"
$ git config --global user.email "إيميلك"
$ git config --global init.defaultBranch main

$ git config --list
user.name=اسمك الحقيقي
user.email=إيميلك
init.defaultbranch=main`, why: 'دي أول حاجة بتتعمل على أي جهاز جديد. لو git config --list طبع اسمك وإيميلك، يبقى انت جاهز تبدأ.' },
    { task: 'في المعمل، نفذ أول مهمة من مهام التدريب: عرّف Git مين انت بأمرين config', code: `$ git config --global user.name "Ahmed Wael"
$ git config --global user.email "ahmed@example.com"
# المعمل بيأكد المهمة تلقائياً أول ما الاتنين يتظبطوا`, why: 'المعمل بيحاكي نفس سلوك Git الحقيقي: لو جربت تعمل commit قبل الإعداد هيطلب منك تظبط هويتك الأول، زي Git الحقيقي بالظبط.' }
  ]
},
{
  id: 'first-repo',
  nav: 'أول repo: init و add و commit',
  title: 'أول repo ليك: init و add و commit',
  subtitle: 'المناطق التلاتة اللي بتعيش فيها ملفاتك، ودورة الحفظ الأساسية',
  blocks: [
    { type: 'p', text: 'الـ repo (مختصر repository) هو أي فولدر Git بيديره. أول ما تعمل `git init` جوه فولدر، Git بيحوله لـ repo: بيضيف فولدر مخفي اسمه `.git` فيه كل التاريخ والإعدادات. امسح `.git` والفولدر يرجع فولدر عادي (وتاريخك يضيع، فمتمسحوش).' },
    { type: 'code', code: `$ mkdir my-project
$ cd my-project
$ git init
Initialized empty Git repository in /home/you/my-project/.git/` },
    { type: 'h', text: 'المناطق التلاتة: أهم صورة ذهنية في Git كلها' },
    { type: 'list', items: [
      'Working Directory (مجلد الشغل): الملفات زي ما انت شايفها وبتعدل عليها.',
      'Staging Area (منطقة التجهيز): ملفات جهزتها للحفظ بالأمر git add. زي سله التسوق قبل ما تدفع.',
      'Repository (المخزن): اللقطات المحفوظة (الـ commits) جوه .git. ده التاريخ الدائم.'
    ] },
    { type: 'p', text: 'الدورة الأساسية: تعدل ملفات في مجلد الشغل ← تجهزها بـ `git add` ← تحفظها بـ `git commit`. كل commit بتاخد اللي في الـ staging بس، مش كل حاجة في الفولدر. عشان كده الـ staging بتديك تحكم دقيق: تحفظ إيه بالظبط في اللقطة دي.' },
    { type: 'h', text: 'أول commit بجد' },
    { type: 'code', code: `$ echo "# My Project" > README.md

$ git status
On branch main

No commits yet

Untracked files:
  (use "git add <file>..." to include in what will be committed)
	README.md

nothing added to commit but untracked files present (use "git add" to track)

$ git add README.md
$ git commit -m "first commit"
[main (root-commit) 0b603ac] first commit
 1 file changed, 1 insertion(+)
 create mode 100644 README.md` },
    { type: 'p', text: 'لاحظ: `git status` هو صديقك المفضل. بيقولك انت فين بالظبط: على أنهي branch، إيه الملفات المتعدلة، إيه اللي في الـ staging، وإيه اللي Git مش بيتابعه (untracked). شغله قبل وبعد أي خطوة وانت بتتعلم.' },
    { type: 'h', text: 'رسائل الـ commit: اكتبها زي ما بتحب تقراها' },
    { type: 'p', text: 'الرسالة `-m "..."` مش رفاهية: بعد شهر، الرسايل دي هي اللي هتفهم منها المشروع بيمشي إزاي. القاعدة: جملة قصيرة بتبدأ بفعل وبتجاوب "الـ commit ده بيعمل إيه؟".' },
    { type: 'list', items: [
      'كويسة: add sales cleaning script / fix total calculation / update README with setup steps',
      'وحشة: update / final / asdfgh / changes'
    ] },
    { type: 'h', text: 'تعديلات ورا بعض' },
    { type: 'code', code: `$ echo "سطر تاني" >> README.md
$ git status
On branch main
Changes not staged for commit:
  (use "git add <file>..." to update what will be committed)
	modified:   README.md

no changes added to commit (use "git add" and/or "git commit -a")

$ git add .
$ git commit -m "update readme"
[main 2112df3] update readme
 1 file changed, 1 insertion(+)` },
    { type: 'p', text: '`git add .` بتجهز كل التعديلات في الفولدر الحالي. مريحة، بس استخدمها وانت فاهم إيه اللي بيتجهز (شغل `git status` الأول).' },
    { type: 'note', warn: true, text: 'غلطة شائعة: تعمل commit وانت قاصد ملفات معينة، فتلاقي حاجات مش عايزها اتخزنت. الحل مش إنك تخاف من الـ commit: الحل إنك تبص على git status قبل كل commit. دي عادة المحترفين.' }
  ],
  quiz: [
    { q: 'الـ Staging Area بتعمل إيه بالظبط؟', options: [
      { text: 'بتحفظ نسخة احتياطية من الملفات على الإنترنت قبل ما تتعدل' },
      { text: 'بتجهز الملفات اللي هتدخل في الـ commit الجاي، فتقدر تختار تحفظ إيه بالظبط' },
      { text: 'بتمسح الملفات القديمة اللي مبقتش محتاجها من مجلد الشغل' }
    ], answer: 1, explain: 'الـ staging زي سله التسوق: بتختار فيها التعديلات اللي هتتحفظ في اللقطة الجاية بـ git commit.' },
    { q: 'git add . بتعمل إيه؟', options: [
      { text: 'بتجهز كل التعديلات في الفولدر الحالي للـ commit' },
      { text: 'بتعمل commit لكل التعديلات مرة واحدة من غير ما تحتاج رسالة' },
      { text: 'بتنشئ ملف جديد فاضي باسم النقطة جوه الفولدر الحالي' }
    ], answer: 0, explain: 'add بتجهز (stage) بس، مش بتحفظ. الحفظ بيتم بـ commit. والنقطة معناها "كل حاجة في الفولدر الحالي".' },
    { q: 'أنهي رسالة commit من دول مكتوبة صح؟', options: [
      { text: 'asdf', mono: true },
      { text: 'fix total calculation in sales report', mono: true },
      { text: 'final', mono: true }
    ], answer: 1, explain: 'الرسالة الكويسة قصيرة، بتبدأ بفعل، وبتوصف التعديل. "final" و "update" مش بيقولوا أي حاجة.' }
  ],
  exercises: [
    { task: 'في المعمل أو على جهازك: اعمل repo جديدة، أنشئ ملف README.md، واحفظه بأول commit. تأكد بالأمر git status إن الشجرة نضيفة', code: `$ git init
Initialized empty Git repository in ~/my-project/.git/

$ echo "# My Project" > README.md
$ git add README.md
$ git commit -m "first commit"
[main (root-commit) 0b603ac] first commit
 1 file changed, 1 insertion(+)
 create mode 100644 README.md

$ git status
On branch main
nothing to commit, working tree clean`, why: '"working tree clean" معناها كل حاجة محفوظة: مفيش تعديلات عائمة. دي الحالة اللي عايز تشوفها بعد كل commit.' },
    { task: 'اعمل 3 commits ورا بعض: كل commit يضيف ملف مختلف (notes.txt و plan.txt و data.csv)، وبعدين شوف التاريخ بـ git log --oneline', code: `$ echo "ملاحظات" > notes.txt && git add . && git commit -m "add notes"
$ echo "خطة العمل" > plan.txt && git add . && git commit -m "add plan"
$ echo "city,revenue" > data.csv && git add . && git commit -m "add sales data"

$ git log --oneline
a1b2c3d add sales data
e4f5g6h add plan
i7j8k9l add notes
0b603ac first commit`, why: 'لاحظ إن log بيعرض الأحدث الأول. كل commit ليه رقم مختلف، والتاريخ بيبني خطوة بخطوة. (الأرقام عندك هتختلف، ده طبيعي: الـ hash بيحسب من المحتوى والوقت.)' }
  ]
},
{
  id: 'history',
  nav: 'قراءة الـ history',
  title: 'قراءة التاريخ: log و show و diff',
  subtitle: 'إزاي تفهم اللي حصل في مشروعك، commit بـ commit وسطر بسطر',
  blocks: [
    { type: 'p', text: 'لحد هنا انت بتحفظ لقطات. قيمة اللقطات دي إنك ترجعلها وتقراها. التلات أوامر دول هما عدستك: `git log` للتاريخ كله، `git show` لـ commit واحدة بالتفصيل، و`git diff` للفروقات السطرية.' },
    { type: 'h', text: 'git log: التاريخ كله' },
    { type: 'code', code: `$ git log
commit 2112df3a4b5c6d7e8f9012345678abcdef1234 (HEAD -> main)
Author: Ahmed Wael <ahmed@example.com>
Date:   Tue Nov 24 03:53:09 2026 +0200

    update readme

commit 0b603acfc3e66ece65fc84ca3deaafe3c058ae2c
Author: Ahmed Wael <ahmed@example.com>
Date:   Tue Nov 24 03:53:09 2026 +0200

    first commit` },
    { type: 'p', text: 'كل commit بترقمها الـ hash الطويل ده (40 حرف)، بس في الاستخدام اليومي أول 7 حروف كفاية. `HEAD -> main` معناها "انت واقف هنا دلوقتي على main".' },
    { type: 'p', text: 'لما التاريخ يطول، النسخة المختصرة أريح بكتير:' },
    { type: 'code', code: `$ git log --oneline
2112df3 update readme
0b603ac first commit` },
    { type: 'h', text: 'git show: تحت الميكروسكوب' },
    { type: 'code', code: `$ git show 2112df3
commit 2112df3a4b5c6d7e8f9012345678abcdef1234
Author: Ahmed Wael <ahmed@example.com>
Date:   Tue Nov 24 03:53:09 2026 +0200

    update readme

diff --git a/README.md b/README.md
index 1f5d6a1..a2f0f8b 100644
--- a/README.md
+++ b/README.md
@@ -1 +1,2 @@
 # My Project
+سطر تاني` },
    { type: 'p', text: '`git show` بيعرض الـ commit والتعديلات اللي فيها: الأسطر اللي اتضافت بعلامة `+` خضرا واللي اتمسحت بـ `-` حمرا. من غير رقم بيعرض آخر commit (`HEAD`).' },
    { type: 'h', text: 'git diff: إيه اللي اتغير دلوقتي؟' },
    { type: 'list', items: [
      'git diff: فرق مجلد الشغل عن الـ staging (تعديلات لسه متجهزتش).',
      'git diff --staged: فرق الـ staging عن آخر commit (اللي هيدخل في الـ commit الجاية).',
      'git diff HEAD~2 HEAD: فرق بين نقطتين في التاريخ.'
    ] },
    { type: 'code', code: `$ echo "سطر جديد" >> README.md
$ git diff
diff --git a/README.md b/README.md
index a2f0f8b..c3d4e5f 100644
--- a/README.md
+++ b/README.md
@@ -1,2 +1,3 @@
 # My Project
 سطر تاني
+سطر جديد` },
    { type: 'p', text: 'قبل كل commit، عاود نفسك: `git diff --staged` يعرضلك بالظبط اللي هيتخزن. لو لقيت حاجة مش مقصودة (print نسيتها، ملف غلط)، لسه قدامك فرصة تظبطها.' },
    { type: 'h', text: 'الرجوع بالرموز: HEAD~' },
    { type: 'p', text: '`HEAD` هو مكانك الحالي. `HEAD~1` (أو `HEAD~`) هو الـ commit اللي قبله، و`HEAD~3` قبله بتلاتة. تقدر تستخدم الرموز دي في أي أمر بياخد commit: `git show HEAD~1` مثلاً يعرضلك اللي قبل الأخير.' },
    { type: 'note', text: 'حركة احترافية: git log --oneline --graph بيرسم التاريخ كشجرة. هتقدرها جداً لما نوصل للـ branches والـ merges في الدروس الجاية.' }
  ],
  quiz: [
    { q: 'عايز تشوف تاريخ الـ commits كل واحدة في سطر مختصر. الأمر الأنسب؟', options: [
      { text: 'git log --oneline', mono: true },
      { text: 'git show', mono: true },
      { text: 'git status', mono: true }
    ], answer: 0, explain: 'log --oneline بيعرض commit في سطر: الرقم المختصر والرسالة. status بيعرض حالة الشغل الحالية مش التاريخ.' },
    { q: 'في مخرجات git diff، السطر اللي بيبدأ بـ + معناه إيه؟', options: [
      { text: 'سطر اتمسح' },
      { text: 'سطر اتضاف' },
      { text: 'سطر متعدل' }
    ], answer: 1, explain: '+ للإضافة و - للمسح. التعديل بيظهر كمسح السطر القديم وإضافة الجديد تحته.' },
    { q: 'HEAD~2 بتشير لإيه؟', options: [
      { text: 'تاني commit اتعمل في المشروع من أول ما اتبدأ' },
      { text: 'الـ commit اللي قبل الحالية باتنين' },
      { text: 'البرانش التاني اللي كنت شغال عليه قبل البرانش الحالي' }
    ], answer: 1, explain: 'العلامة ~ معناها "ارجع ورا": HEAD~1 الأب المباشر، HEAD~2 الجد. بتشتغل في show و diff و reset وغيرهم.' }
  ],
  exercises: [
    { task: 'في repo فيها 3 commits على الأقل: اعرض التاريخ المختصر، وبعدين افحص أقدم commit بالتفصيل بـ git show', code: `$ git log --oneline
2112df3 update readme
0b603ac first commit

$ git show 0b603ac
commit 0b603acfc3e66ece65fc84ca3deaafe3c058ae2c
Author: Ahmed Wael <ahmed@example.com>
Date:   Tue Nov 24 03:53:09 2026 +0200

    first commit

diff --git a/README.md b/README.md
new file mode 100644
index 0000000..1f5d6a1
--- /dev/null
+++ b/README.md
@@ -0,0 +1 @@
+# My Project`, why: 'أول commit بتبان فيها كل الأسطر كإضافات لأن الملف اتخلق من العدم. لاحظ index 0000000: يعني مفيش نسخة سابقة.' },
    { task: 'عدل ملف، وبعدين قارن بـ git diff قبل ما تضيف للـ staging، وبـ git diff --staged بعد الإضافة. لاحظ إن الأولى بتفضي بعد add', code: `$ echo "تعديل" >> README.md
$ git diff          # بيعرض +تعديل
$ git add README.md
$ git diff          # (فاضي: مفيش تعديلات بره الـ staging)
$ git diff --staged # بيعرض +تعديل: ده اللي هيتخزن في الـ commit`, why: 'فهم الفرق بين الأمرين بيوضحلك المناطق التلاتة عملياً. diff من غير حاجة = شغل غير مجهز. --staged = اللي هيتحفظ.' }
  ]
},
{
  id: 'branches',
  nav: 'الـ Branches',
  title: 'الـ Branches: اشتغل على ميزة من غير ما تبوظ الأساسي',
  subtitle: 'إيه هو الـ branch، وإزاي تنشئه وتتنقل بينه وبين main',
  blocks: [
    { type: 'p', text: 'الـ branch هو أهم فكرة في Git بعد الـ commit نفسه. تخيل إنك عايز تجرب ميزة جديدة في مشروعك بس مش متأكد منها: بدل ما تعدل على النسخة الشغالة، بتعمل فرع تجريبي لوحدك. لو الميزة نجحت، تدمجها في الأساسي. لو فشلت، تمسح الفرع وكأن حاجة ماحصلتش.' },
    { type: 'p', text: 'تقنياً، الـ branch مش نسخة من الملفات: هو مجرد مؤشر (pointer) بيشاور على commit. إنشاء branch جديد رخيص وفوري لأنه بيعمل المؤشر ده بس، من غير ما ينسخ أي حاجة.' },
    { type: 'h', text: 'الإنشاء والتنقل' },
    { type: 'code', code: `$ git branch
* main

$ git switch -c feature
Switched to a new branch 'feature'

$ git branch
* feature
  main` },
    { type: 'p', text: '`git switch -c feature` بتعمل حاجتين: تنشئ البرانش (`-c` = create) وتنقلك عليه. النجمة في `git branch` بتقولك انت فين. (في نسخ Git القديمة هتلاقي `git checkout -b feature` بتعمل نفس الحاجة، وهتلاقيها في شروحات كتير.)' },
    { type: 'h', text: 'الشغل على البرانش مش بيأثر على main' },
    { type: 'code', code: `$ echo "ميزة جديدة" > feature.txt
$ git add .
$ git commit -m "add feature.txt"
[feature 8f93776] add feature.txt
 1 file changed, 1 insertion(+)
 create mode 100644 feature.txt

$ git switch main
Switched to branch 'main'

$ ls
README.md
# feature.txt مش موجودة هنا! لسه على البرانش التاني` },
    { type: 'p', text: 'لاحظ السحر: لما رجعت main، ملف feature.txt اختفى من الفولدر. مش اتمسح: هو محفوظ في commits البرانش feature. Git بيغير محتوى مجلد الشغل حسب الـ branch اللي انت عليه.' },
    { type: 'h', text: 'إزاي بيفكر المحترفين بالـ branches' },
    { type: 'list', items: [
      'main (أو master قديماً) هو البرانش الأساسي: دايماً في حالة شغالة ونضيفة.',
      'أي شغل جديد = branch جديد باسم وصفي: feature/sales-chart أو fix-login-bug.',
      'البرانش مؤقت: يتدمج في main وبعدها يتمسح. مش بيتعاش عليه.',
      'ممكن يكون عندك branches كتير في نفس الوقت، ومحدش فيهم يأثر على التاني.'
    ] },
    { type: 'p', text: 'لما تتنقل بين branches وعندك تعديلات غير محفوظة، Git بياخدها معاه (أو يرفض لو هتتكسر). القاعدة الذهبية: قبل ما تغير الـ branch، اعمل commit للي في إيدك أو خليه لوقت تاني.' },
    { type: 'note', text: 'في المعمل، المهمة رقم 4 و 5 بتخليك تعمل أول branch وcommit عليه، وهتشوف في لوحة الحالة إن مؤشر main واقف مكانه و feature بيتحرك. جربها دلوقتي لو حابب التطبيق الفوري.' }
  ],
  quiz: [
    { q: 'الـ branch في Git تقنياً هو إيه؟', options: [
      { text: 'نسخة كاملة من ملفات المشروع في فولدر جنبي' },
      { text: 'مؤشر بيشاور على commit معينة' },
      { text: 'ملف إعدادات' }
    ], answer: 1, explain: 'الـ branch مجرد اسم بيشاور على commit. عشان كده إنشاؤه فوري ورخيص، والتنقل بين branches هو بس تغيير اللي Git بيشاور عليه.' },
    { q: 'إيه أمر إنشاء branch جديد والانتقال ليه في خطوة واحدة؟', options: [
      { text: 'git branch feature', mono: true },
      { text: 'git switch -c feature', mono: true },
      { text: 'git merge feature', mono: true }
    ], answer: 1, explain: 'switch -c = create + switch. branch feature لوحدها بتنشئ من غير ما تنقلك. (و checkout -b هي الصيغة الأقدم المكافئة.)' },
    { q: 'عملت commit على branch اسمه feature وبعدين رجعت main. إيه اللي هيحصل لملفات feature في مجلد الشغل؟', options: [
      { text: 'هتفضل موجودة في مجلد الشغل زي ما هي لأن الملفات مش بتتغير بتغيير البرانش' },
      { text: 'هتتمسح نهائياً ومش هتقدر ترجعها حتى لو رجعت لـ feature تاني' },
      { text: 'هتختفي من مجلد الشغل لأنها محفوظة في commits البرانش التاني، وهترجع أول ما ترجع feature' }
    ], answer: 2, explain: 'Git بيحدث مجلد الشغل حسب الـ branch الحالي. الملفات مش بتضيع، هي محفوظة في تاريخ البرانش التاني.' }
  ],
  exercises: [
    { task: 'اعمل branch باسم feature وأنتقل ليه، أضف ملف جديد واعمل commit، ارجع main وشوف الملفات بـ ls، وبعدين ارجع feature تاني', code: `$ git switch -c feature
Switched to a new branch 'feature'

$ echo "محتوى الميزة" > feature.txt
$ git add . && git commit -m "add feature.txt"
[feature 8f93776] add feature.txt

$ git switch main
Switched to branch 'main'
$ ls
README.md

$ git switch feature
Switched to branch 'feature'
$ ls
README.md  feature.txt`, why: 'تبديل الملفات مع تبديل الـ branch هو أوضح دليل إن Git بيدير نسخ مش مجرد فولدر. لو ls عرضت الملف في main، يبقى الـ commit حصل على main بالغلط.' },
    { task: 'اعرض الـ branches الموجودة ولاحظ النجمة، وبعدين امسح branch تجريبي بعد ما ترجع main (هيرفض لو فيه commits مش مدمجة، جرب -D)', code: `$ git branch
* main
  feature

$ git branch -d feature
error: the branch 'feature' is not fully merged
hint: If you are sure you want to delete it, run 'git branch -D feature'

$ git branch -D feature
Deleted branch feature (was 8f93776).`, why: 'Git بيحميك من مسح شغل مش مدمج في main. -D بتتخطى الحماية دي، فاستخدمها وانت متأكد. في الدرس الجاي هتتعلم تدمج قبل المسح.' }
  ]
},
{
  id: 'merging',
  nav: 'الدمج (Merging)',
  title: 'الدمج: إزاي ترجع شغل الـ branch للأساسي',
  subtitle: 'Fast-forward و merge commit، وإزاي تقفل دورة الشغل بشكل نضيف',
  blocks: [
    { type: 'p', text: 'خلصت الميزة على الـ branch؟ وقت إرجاعها لـ main. الأمر هو `git merge` وانت واقف على البرانش المستقبل (main)، وبتقوله يدمج البرانش التاني فيه.' },
    { type: 'h', text: 'الحالة الأولى: Fast-forward (الأسهل)' },
    { type: 'code', code: `$ git switch main
Switched to branch 'main'

$ git merge feature
Updating 2112df3..8f93776
Fast-forward
 feature.txt | 1 +
 1 file changed, 1 insertion(+)
 create mode 100644 feature.txt` },
    { type: 'p', text: 'لو main ماتحركتش من ساعة ما عملت الـ branch، Git بس بيحرك مؤشر main لقدام لمكان feature. مفيش دمج حقيقي: بس "سحب للأمام". ده اسمه fast-forward وهو ما حصل في المثال ده.' },
    { type: 'h', text: 'الحالة التانية: Merge commit (لما الطرفين يتحركوا)' },
    { type: 'p', text: 'لو main اتحركت هي كمان (حد دمج شغل تاني مثلاً)، مفيش سحب للأمام ينفع: لازم Git يدمج خطين تاريخ مختلفين. بيعملها بإنشاء merge commit: commit خاصة ليها أب وأم (parents اتنين) بتوحدهم.' },
    { type: 'code', code: `$ git merge feature
Merge made by the 'ort' strategy.
 reports.txt | 4 ++++
 1 file changed, 4 insertions(+)` },
    { type: 'p', text: 'طالما الطرفين عدلوا ملفات مختلفة (أو أسطر مختلفة من نفس الملف)، الدمج بيتم لوحده من غير تدخل منك. الحالة الوحيدة اللي بتحتاجك هي لما الطرفين يعدلوا نفس الأسطر: دي الـ conflict ولسه نتكلم عنها في الدرس الجاي.' },
    { type: 'h', text: 'أرشيف الدمج بالصور' },
    { type: 'code', code: `$ git log --oneline --graph
*   62565ae resolve conflict: دمج النسختين
|\\
| * fc36cf3 hotfix: تعديل README
* | d5e4f0e update README على main
|/
* 8f93776 add feature.txt
* 2112df3 update readme
* 0b603ac first commit` },
    { type: 'p', text: 'الرسمة دي بتوريك شجرة التاريخ: الفروع بتتفرع وبتتلحم. كل نقطة `*` هي commit، والخطوط بتوضح الأبوين. شغلها بعد كل merge وهتفهم التاريخ بتاعك فهم مش حفظ.' },
    { type: 'h', text: 'بعد الدمج الناجح: نظف' },
    { type: 'code', code: `$ git branch -d feature
Deleted branch feature (was 8f93776).

$ git branch
* main` },
    { type: 'p', text: 'بعد ما الـ branch اتدمج، دوره انتهى. `git branch -d` بتمسحه بأمان: Git بيرفض لو فيه commits مش مدمجة (عشان كده -d آمنة، مش زي -D). main دلوقتي فيه كل حاجة.' },
    { type: 'note', text: 'ملخص دورة الشغل: branch جديد ← commits ← merge في main ← مسح الـ branch. الدورة دي اسمها GitHub Flow وهتقابلها تاني في درس شغل GitHub.' }
  ],
  quiz: [
    { q: 'إمتى بيحصل Fast-forward merge؟', options: [
      { text: 'لما الـ branch المستقبل (main) ماتحركش من ساعة ما الـ branch اتعمل' },
      { text: 'لما يكون في conflict بين التعديلات وتحتاج تحلها بإيدك الأول' },
      { text: 'لما نستخدم git merge --fast وبنكتب الأمر بالصيغة دي بالظبط' }
    ], answer: 0, explain: 'لو main واقفة مكانها، مفيش حاجة تتدمج فعلاً: Git بس بيحرك المؤشر لقدام. أول ما الطرفين يتحركوا، لازم merge commit.' },
    { q: 'الـ merge commit بتتميز بإيه عن أي commit عادية؟', options: [
      { text: 'لونها مختلف في git log عشان تبان وسط باقي الـ commits' },
      { text: 'ليها أبوان (parents اتنين): طرفي الدمج' },
      { text: 'مش بتتعرض في git log خالص لأنها commit داخلية بيعملها Git' }
    ], answer: 1, explain: 'أي commit عادية ليها أب واحد. الـ merge commit بتوحد خطين، فلازم تفتكر الاتنين: ده اللي بيرسم الشجرة في log --graph.' },
    { q: 'ليه git branch -d feature أحياناً بترفض تمسح؟', options: [
      { text: 'لأن Git بيهنج أحياناً لما يكون في branches كتير على الجهاز' },
      { text: 'لأن فيه commits على feature لسه مش مدمجة في الـ branch الحالي' },
      { text: 'لأن لازم نستخدم sudo عشان نمسح branch على النظام' }
    ], answer: 1, explain: 'دي حماية مش عطل: Git بيرفض يمسح شغل ممكن يضيع. لو متأكد إنك عايز تمسح، -D بتجبر المسح.' }
  ],
  exercises: [
    { task: 'نفذ دورة كاملة: branch ← commit ← merge (هيكون fast-forward) ← مسح الـ branch. تأكد من النتيجة بـ git log --oneline', code: `$ git switch -c reports
$ echo "تقرير المبيعات" > reports.txt
$ git add . && git commit -m "add sales report"
[reports 3a4b5c6] add sales report

$ git switch main
$ git merge reports
Updating 2112df3..3a4b5c6
Fast-forward
 reports.txt | 1 +
 1 file changed, 1 insertion(+)

$ git branch -d reports
Deleted branch reports (was 3a4b5c6).`, why: 'دي الدورة اللي هتعيشها يومياً في أي شغل حقيقي. اعملها عشر مرات في المعمل لحد ما تبقى في ضهر قلبك.' },
    { task: 'اصنع merge commit حقيقي: بعد ما تعمل الـ branch، اعمل commit على main قبل ما تدمج، وبعدين ادمج ولاحظ الرسالة المختلفة', code: `$ git switch -c feature
$ echo "ميزة" > f.txt && git add . && git commit -m "feature work"
$ git switch main
$ echo "شغل تاني" > g.txt && git add . && git commit -m "main work"
$ git merge feature
Merge made by the 'ort' strategy.
 f.txt | 1 +
 1 file changed, 1 insertion(+)

$ git log --oneline --graph
*   a1b2c3d Merge branch 'feature'
|\\
| * e4f5g6h feature work
* | i7j8k9l main work
|/`, why: 'لما الطرفين يتحركوا، Git مش بيقدر يسحب للأمام: بيعمل commit دمج ليها أبوان. الرسمة بتوضح الشكل، والملفين الاتنين بيبقوا موجودين بعد الدمج.' }
  ]
},
{
  id: 'conflicts',
  nav: 'الـ Conflicts من غير زعر',
  title: 'حل الـ Merge Conflicts من غير زعر',
  subtitle: 'إزاي الـ conflict بيحصل، إزاي تقراه، وإزاي تحله في دقايق',
  blocks: [
    { type: 'p', text: 'أول مرة تشوف فيها كلمة CONFLICT في الترمنال بتخض. بس الحقيقة إن الـ conflict مش خطأ ومش كارثة: Git بيقولك "أنا مش هقرر عنك: نفس السطر اتعدل بطريقتين مختلفتين، تعالى اختار". الموضوع كله عبارة عن 4 خطوات.' },
    { type: 'h', text: 'إزاي بيحصل؟' },
    { type: 'p', text: 'لما تعمل merge (أو pull) والطرفين عدلوا نفس المنطقة من نفس الملف بطرق مختلفة. Git بيقدر يدمج أي حاجة تانية لوحده، بس دي الحالة الوحيدة اللي بيسألك فيها.' },
    { type: 'code', code: `$ git merge hotfix
Auto-merging README.md
CONFLICT (content): Merge conflict in README.md
Automatic merge failed; fix conflicts and then commit the result.` },
    { type: 'h', text: 'الخطوة 1: افهم الوضع بـ status' },
    { type: 'code', code: `$ git status
On branch main
You have unmerged paths.
  (fix conflicts and run "git commit")
  (use "git merge --abort" to abort the merge)

Unmerged paths:
  (use "git add <file>..." to mark resolution)
	both modified:   README.md` },
    { type: 'h', text: 'الخطوة 2: افتح الملف واقرأ العلامات' },
    { type: 'code', code: `<<<<<<< HEAD
نسختك انت
=======
نسخة زميلك
>>>>>>> hotfix` },
    { type: 'list', items: [
      'من <<<<<<< HEAD لحد ======= : نسختك انت (البرانش اللي انت واقف عليه).',
      'من ======= لحد >>>>>>> hotfix : نسخة البرانش الجاي.',
      'ممكن يكون في أكتر من منطقة متعارضة في نفس الملف، وكلها بنفس العلامات.'
    ] },
    { type: 'h', text: 'الخطوة 3: حرر الملف بإيدك' },
    { type: 'p', text: 'امسح العلامات التلاتة وخلي المحتوى اللي عايزه: نسختك، نسختهم، أو خليط من الاتنين. القرار قرارك انت كبني آدم فاهم المحتوى، مش قرار Git.' },
    { type: 'code', code: `# بعد التحرير، الملف بقى كده:
الحل النهائي` },
    { type: 'h', text: 'الخطوة 4: add ثم commit' },
    { type: 'code', code: `$ git add README.md
$ git commit -m "resolve conflict: دمج النسختين"
[main 62565ae] resolve conflict: دمج النسختين` },
    { type: 'p', text: 'الـ `git add` هنا معناها "أنا حليت الملف ده"، والـ commit بتقفل الـ merge. كده خلصت. نفس الخطوات بالظبط مع أي عدد ملفات متعارضة.' },
    { type: 'h', text: 'زرار الطوارئ: abort' },
    { type: 'code', code: `$ git merge --abort` },
    { type: 'p', text: 'لو في نص الـ merge حسيت إنك داخل في دوامة، `git merge --abort` بترجعك للحالة قبل الـ merge تماماً وكأن حاجة ماحصلتش. تقدر ترجع تحل بعدين بهدوء.' },
    { type: 'note', warn: true, text: 'أكبر غلطة: تحل الـ conflict بسرعة وتختار نسخة تمسح شغل حد من غير ما تفهمه. خد دقيقة تفهم ليه النسختين مختلفين قبل ما تختار. الهدف مش تخلص من العلامات، الهدف إن الكود الصح يفضل.' },
    { type: 'note', text: 'في المعمل، مهمة "حل conflict من غير زعر" بتحضرلك السيناريو كله تلقائياً: انت وزميل وهمي عدلتوا نفس الملف. جرب الدمج والحل بنفسك.' }
  ],
  quiz: [
    { q: 'إمتى بيحصل merge conflict؟', options: [
      { text: 'لما يكون في ملفات كتير أوي في المشروع والـ merge يحتاج وقت' },
      { text: 'لما الطرفين يعدلوا نفس المنطقة من نفس الملف بطرق مختلفة' },
      { text: 'لما النت يفصل أثناء الـ merge فالعملية تتقطع في النص' }
    ], answer: 1, explain: 'Git بيدمج أي حاجة لوحده طالما التعديلات في أماكن مختلفة. التعارض بيحصل بس لما نفس الأسطر تتعدل بطريقتين.' },
    { q: 'في علامات الـ conflict، الجزء اللي بين <<<<<<< HEAD و ======= بيمثل إيه؟', options: [
      { text: 'نسخة البرانش الجاي' },
      { text: 'النسخة القديمة من الملف' },
      { text: 'نسختك انت على البرانش الحالي' }
    ], answer: 2, explain: 'HEAD دايماً هو "انت". الجزء التاني (بين ======= و >>>>>>>) هو نسخة البرانش اللي بتدمجه.' },
    { q: 'إيه ترتيب خطوات حل الـ conflict الصحيح؟', options: [
      { text: 'commit ← add ← تحرير الملف ← status بالترتيب ده' },
      { text: 'تحرير الملف ومسح العلامات ← git add ← git commit' },
      { text: 'git push ← git add ← git commit ← مسح العلامات بعد كده' }
    ], answer: 1, explain: 'حرر واختار المحتوى الصح، add بتوضح إنك خلصت الملف، commit بتقفل الـ merge. ولو لخبطت: merge --abort بترجعك للأمان.' }
  ],
  exercises: [
    { task: 'في المعمل، كمل مهمة "حل conflict من غير زعر": ادمج hotfix، اقرأ الملف بـ cat، حله بـ echo، وسجل الحل بـ add و commit', code: `$ git merge hotfix
Auto-merging README.md
CONFLICT (content): Merge conflict in README.md
Automatic merge failed; fix conflicts and then commit the result.

$ cat README.md
<<<<<<< HEAD
نسختك انت
=======
نسخة زميلك
>>>>>>> hotfix

$ echo "الحل النهائي" > README.md
$ git add README.md
$ git commit -m "resolve conflict"
[main 62565ae] resolve conflict`, why: 'نفس خطوات Git الحقيقي بالمللي. لاحظ إن commit بتاعت الحل هي merge commit ليها أبوان، وده اللي بيقفل الدمج رسمياً.' },
    { task: 'على جهازك (أو في المعمل بسيناريو من إيدك): اصنع conflict متعمد بين branchين على نفس الملف، وحله مرة باختيار نسختك ومرة باختيار خليط من النسختين', code: `# سيناريو من إيدك:
$ git switch -c a && echo "نسخة A" > f.txt && git add . && git commit -m "a"
$ git switch main && echo "نسخة B" > f.txt && git add . && git commit -m "b"
$ git merge a        # CONFLICT
$ cat f.txt          # اقرأ العلامات
$ echo "نسخة A + B مجتمعين" > f.txt
$ git add f.txt && git commit -m "merge a: خليط من النسختين"`, why: 'أحسن طريقة تشيل رهبة الـ conflicts إنك تصنعها بإيدك في بيئة آمنة. بعد تالت conflict هتتعامل معاهم كأنهم شغلانة عادية.' }
  ]
}
);
