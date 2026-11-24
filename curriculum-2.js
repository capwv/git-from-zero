/* Curriculum part 2: remotes, push/pull, GitHub flow, PRs, README, gitignore, undo, capstone */
var CURRICULUM = window.CURRICULUM || [];
CURRICULUM.push(
{
  id: 'remotes',
  nav: 'GitHub والـ Remotes',
  title: 'الربط مع GitHub: Remotes و Clone',
  subtitle: 'إزاي توصل الـ repo المحلية بنسخة على GitHub، وإزاي تنزل مشاريع الناس',
  blocks: [
    { type: 'p', text: 'لحد دلوقتي كل حاجة عايشة على جهازك بس. الـ remote هو نسخة من الـ repo على سيرفر (غالباً GitHub) بتتزامن مع نسختك. الـ remote الافتراضي اسمه `origin`، وهو العنوان اللي بتبعتله شغلك وبتستلم منه شغل غيرك.' },
    { type: 'h', text: 'حساب GitHub وأول repo أونلاين' },
    { type: 'list', items: [
      'اعمل حساب مجاني على github.com (إيميل + باسورد، والإيميل الأفضل يكون نفس اللي ضبطته في git config).',
      'من زرار New اعمل repository جديدة: سميها زي مشروعك، وخليها Public، ومتعملش initialize بأي ملفات (هنرفع اللي عندنا).',
      'GitHub هيعرضك صفحة فيها الأوامر الجاهزة: هي نفس اللي تحت دي بالظبط.'
    ] },
    { type: 'h', text: 'الربط: git remote add' },
    { type: 'code', code: `$ git remote add origin https://github.com/you/first-repo.git
$ git remote -v
origin	https://github.com/you/first-repo.git (fetch)
origin	https://github.com/you/first-repo.git (push)` },
    { type: 'p', text: 'كده Git بقى عارف إن فيه نسخة اسمها origin على العنوان ده. مفيش أي حاجة اترفعت لسه: الربط مجرد عنوان محفوظ. الرفع نفسه اسمه push وده درسنا الجاي.' },
    { type: 'h', text: 'الاتجاه العكسي: clone' },
    { type: 'p', text: 'لما تحب تنزل مشروع موجود على GitHub (مشروع زميل، مكتبة، أو الأكاديمية دي نفسها):' },
    { type: 'code', code: `$ git clone https://github.com/octocat/hello-world.git
Cloning into 'hello-world'...
remote: Enumerating objects: 7, done.
remote: Total 7 (delta 0), reused 0 (delta 0), pack-reused 0
Receiving objects: 100% (7/7), done.` },
    { type: 'p', text: '`clone` بتعمل 3 حاجات في خطوة: تنزل الـ repo كلها بتاريخها، تنشئ فولدر باسمها، وتربطها بالـ remote تلقائياً (origin جاهز). جرب تدخل الفولدر وتعمل `git log`: هتلاقي تاريخ المشروع كله.' },
    { type: 'h', text: 'تسجيل الدخول من الترمنال' },
    { type: 'p', text: 'أول push هيطلب منك تسجل دخول لـ GitHub. الباسورد العادي مش مقبول من 2021: الحلول الرسمية هي Git Credential Manager (بييجي مع Git for Windows وبيعمل تسجيل دخول من المتصفح) أو Personal Access Token من إعدادات GitHub (Settings → Developer settings → Tokens). أول مرة بس، وبعدها بيتخزن.' },
    { type: 'note', text: 'مهمة "انزل أول repo بـ clone" في المعمل بتخليك تجرب clone بمشروع تدريبي جاهز فيه تاريخ وcommits، من غير إنترنت ولا حساب.' }
  ],
  quiz: [
    { q: 'الـ remote اللي اسمه origin هو إيه؟', options: [
      { text: 'اسم جهازك' },
      { text: 'العنوان الافتراضي للنسخة المستضافة من الـ repo (غالباً على GitHub)' },
      { text: 'أول commit في المشروع' }
    ], answer: 1, explain: 'origin هو الاسم التقليدي لأول remote بيتربط بالـ repo. تقدر تشوفه بـ git remote -v.' },
    { q: 'git remote add origin <url> بتعمل إيه؟', options: [
      { text: 'بترفع ملفاتك على GitHub فوراً' },
      { text: 'بتسجل عنوان الـ remote عند Git من غير ما ترفع أي حاجة' },
      { text: 'بتنزل المشروع من GitHub' }
    ], answer: 1, explain: 'الأمر بيسجل العنوان بس. الرفع بيتم بـ git push، والتنزيل بـ git clone أو git pull.' },
    { q: 'git clone بتعمل إيه بالظبط؟', options: [
      { text: 'بتنزل آخر نسخة من الملفات بس من غير تاريخ' },
      { text: 'بتنزل الـ repo كاملة بتاريخها وتنشئ فولدر وتربط الـ remote تلقائياً' },
      { text: 'بتعمل نسخة احتياطية على GitHub' }
    ], answer: 1, explain: 'clone بتنزل كل حاجة: الملفات والتاريخ والـ branches، وتجهز origin لوحده. بعدها تقدر تعمل log و push و pull عادي.' }
  ],
  exercises: [
    { task: 'اعمل حساب GitHub (لو معندكش) و repo جديدة فاضية، واربطها بمشروعك المحلي بـ git remote add، وتأكد بـ git remote -v', code: `$ git remote add origin https://github.com/USERNAME/first-repo.git
$ git remote -v
origin	https://github.com/USERNAME/first-repo.git (fetch)
origin	https://github.com/USERNAME/first-repo.git (push)`, why: 'ظهور السطرين دول معناه إن الربط تمام: origin بقت تعرف تستلم (push) وتجيب (fetch) من نفس العنوان.' },
    { task: 'في المعمل: نفذ مهمة clone وافحص المشروع اللي نزل بـ ls و git log', code: `$ git clone https://github.com/octocat/hello-world.git
Cloning into 'hello-world'...
done.
$ cd hello-world
$ ls
README.md
$ git log --oneline
3f78685 fix typo in README
7fd1a60 Initial commit`, why: 'أهم حاجة تلاحظها: التاريخ جه كامل مع الـ clone. المشروع مش مجرد ملفات، هو تاريخ كامل قابل للتفحص.' }
  ]
},
{
  id: 'push-pull',
  nav: 'Push و Pull',
  title: 'رفع واستقبال الشغل: push و pull',
  subtitle: 'أول push بإعداد الـ upstream، والتزامن اليومي مع الـ remote',
  blocks: [
    { type: 'p', text: '`push` بترفع commits المحلية للـ remote، و`pull` بتجيب الجديد من الـ remote وتدمجه في برانشك. دول أمرين هتستخدمهم كل يوم. بينهم فيه أمر تالت هادي اسمه `fetch`: بيجيب الجديد من غير ما يدمج، عشان تبص الأول.' },
    { type: 'h', text: 'أول push: إعداد الـ upstream' },
    { type: 'code', code: `$ git push -u origin main
Enumerating objects: 3, done.
Counting objects: 100% (3/3), done.
Writing objects: 100% (3/3), 240 bytes | 240.00 KiB/s, done.
Total 3 (delta 0), reused 0 (delta 0), pack-reused 0
To https://github.com/you/first-repo.git
 * [new branch]      main -> main
branch 'main' set up to track 'origin/main'.` },
    { type: 'p', text: '`-u` (اختصار --set-upstream) بتقول لـ Git: برانش main المحلي ده بيتبع origin/main. مرة واحدة في عمر الـ branch، وبعدها `git push` و `git pull` من غير أي تفاصيل بيعرفوا يروحوا فين.' },
    { type: 'h', text: 'لما الـ remote يبقى فيه شغل جديد' },
    { type: 'code', code: `$ git pull
remote: Enumerating objects: 5, done.
From https://github.com/you/first-repo.git
   cc1228f..fff303b  main -> origin/main
Updating cc1228f..fff303b
Fast-forward
 1 file changed, 2 insertions(+)` },
    { type: 'p', text: '`pull` هي عملياً `fetch` وبعدين `merge` في خطوة واحدة: بتجيب commits الجديدة وبتدمجها. لو زميلك عدل نفس الأسطر اللي انت عدلتها، هتقابل نفس الـ conflicts اللي اتدربت عليها، وبنفس الحل بالظبط.' },
    { type: 'h', text: 'لما push تترفض (وليه ده كويس)' },
    { type: 'code', code: `$ git push
To https://github.com/you/x.git
 ! [rejected]        main -> main (non-fast-forward)
error: failed to push some refs to 'https://github.com/you/x.git'
hint: Updates were rejected because the remote contains work that you do
hint: not have locally. This is usually caused by another repository pushing
hint: to the same ref. You may want to first integrate the remote changes
hint: by merging (e.g., 'git pull ...') before pushing again.` },
    { type: 'p', text: 'الرفض ده معناه: "الـ remote فيها commits انت معندكش". الحل دايماً: `git pull` الأول (ادمج شغلهم)، حل أي conflicts لو ظهرت، وبعدين push تاني. Git بيحمي شغل الفريق من الكتابة فوق بعضه.' },
    { type: 'h', text: 'الروتين اليومي' },
    { type: 'list', items: [
      'قبل ما تبدأ شغل: git pull (خد آخر تحديث).',
      'اشتغل: تعديلات ← add ← commit (كذا مرة).',
      'في آخر الجلسة: git push (شارك شغلك).',
      'لو push اترفضت: pull، حل، push. ممنوع force push على branch مشترك.'
    ] },
    { type: 'note', warn: true, text: 'git push --force بتمسح تاريخ الـ remote وتستبدله بتاريخك. على branch شخصي لوحدك ممكن يكون ليها مبرر نادر، بس على main أو أي branch مشترك هي كارثة بتمحي شغل الناس. هتشوف البدائل الآمنة في درس التراجع.' }
  ],
  quiz: [
    { q: 'git push -u origin main حرف الـ u بيعمل إيه؟', options: [
      { text: 'بيرفع الملفات بسرعة أكبر' },
      { text: 'بيخلي main المحلي يتبع origin/main، فالأوامر الجاية تعرف طريقها من غير تفاصيل' },
      { text: 'بيخلي الـ push مشفر' }
    ], answer: 1, explain: 'الـ upstream بيحفظ العلاقة بين البرانش المحلي ونسخته على الـ remote. بعدها git push و git pull لوحدهم كفاية.' },
    { q: 'git pull بتساوي إيه تحت الغطا؟', options: [
      { text: 'git fetch وبعدين git merge' },
      { text: 'git clone من جديد' },
      { text: 'git push بالعكس' }
    ], answer: 0, explain: 'pull = fetch (جيب الجديد) + merge (ادمجه في برانشك). عشان كده ممكن تظهر merge conflicts أثناء pull، وحلها نفس حل merge العادي.' },
    { q: 'push اترفضت برسالة non-fast-forward. إيه التصرف الصح؟', options: [
      { text: 'git push --force فوراً' },
      { text: 'امسح الـ repo وابدأ من الأول' },
      { text: 'git pull عشان تدمج الشغل الجديد، حل أي conflicts، وبعدين push تاني' }
    ], answer: 2, explain: 'الـ remote فيها شغل انت مش واخده. pull بيدمجه، وبعدها push بتعدي. force بتمسح شغل زمايلك.' }
  ],
  exercises: [
    { task: 'في المعمل: كمل مهمة "ارفع شغلك على GitHub" (بتحضرلك remote وهمي) ومهمة "استقبل تحديثات من زميلك" (بتضيف commit على الـ remote بتاع زميلك، وجيبها بـ pull)', code: `$ git push -u origin main
To https://github.com/you/first-repo.git
 * [new branch]      main -> main
branch 'main' set up to track 'origin/main'.

# بعدين زميلك دفع commit من عنده:
$ git pull
From https://github.com/you/first-repo.git
   cc1228f..fff303b  main -> origin/main
Updating cc1228f..fff303b
Fast-forward
 1 file changed, 2 insertions(+)
$ ls
README.md  team-notes.txt`, why: 'المعمل بيحاكي remote حقيقي بـ commits من زميل وهمي، فتشوف دورة push/pull كاملة بسيناريو قريب من الشغل الحقيقي.' },
    { task: 'على جهازك: ارفع مشروعك على الـ repo اللي عملتها في الدرس اللي فات، وبعدين عدل ملف من واجهة GitHub نفسها (زرار القلم) وجيب التعديل محلياً بـ pull', code: `# على جهازك:
$ git push -u origin main

# من المتصفح: افتح الملف على GitHub ← Edit ← commit changes

# رجوع للترمنال:
$ git pull
Updating a1b2c3d..e4f5g6h
Fast-forward
 README.md | 1 +
 1 file changed, 1 insertion(+)`, why: 'التعديل من واجهة GitHub بيحاكي "زميل دفع شغل". pull لازم يجيبه ويظهر في الملف عندك. دي أبسط تجربة تزامن حقيقية.' }
  ]
},
{
  id: 'github-flow',
  nav: 'شغل GitHub المنظم',
  title: 'الشغل المنظم على GitHub: GitHub Flow و Issues',
  subtitle: 'دورة الشغل اللي بتمشي بيها الفرق الحقيقية، من الـ issue للـ merge',
  blocks: [
    { type: 'p', text: 'لما تشتغل لوحدك، ممكن تعمل commit على main على طول. لما تشتغل مع ناس (أو حتى على مشروع جاد لوحدك)، فيه دورة بسيطة وقوية اسمها GitHub Flow بتحافظ على main شغالة دايماً.' },
    { type: 'h', text: 'خطوات GitHub Flow' },
    { type: 'list', items: [
      '1. افتح issue (أو استلم واحدة): وصف المشكلة أو الميزة المطلوبة.',
      '2. اعمل branch من main باسم وصفي: feature/sales-chart أو fix-total-bug.',
      '3. اشتغل واعمل commits صغيرة وواضحة.',
      '4. ادفع الـ branch لـ GitHub وافتح Pull Request.',
      '5. مراجعة ونقاش (review)، وتعديلات لو مطلوبة.',
      '6. دمج (merge) في main ومسح الـ branch.'
    ] },
    { type: 'p', text: 'القاعدة الجوهرية: محدش بيعمل commit على main على طول. كل حاجة بتعدي على branch و Pull Request. كده main دايماً مستقرة، وكل تغيير ليه نقاش وتاريخ واضح.' },
    { type: 'h', text: 'Issues: قائمة الشغل' },
    { type: 'p', text: 'الـ issue هي بطاقة شغل على GitHub: عنوان، وصف، وصاحب مسؤول (assignee)، وملصقات (labels) زي bug أو enhancement. حتى في مشروعك الشخصي، فتح issue لكل فكرة أو مشكلة بيحول دماغك لقائمة منظمة.' },
    { type: 'code', code: `# مثال issue كويسة:
# العنوان: Total in sales report ignores returns
# الوصف:
# Steps: شغل build_report على بيانات مارس
# المتوقع: الإجمالي بعد خصم المرتجعات
# الفعلي: الإجمالي بيحسب المبيعات بس
# البيانات: march_sales.csv مرفقة` },
    { type: 'h', text: 'Branches بأسماء تتفهم' },
    { type: 'list', items: [
      'feature/... لميزة جديدة: feature/export-pdf',
      'fix/... لإصلاح: fix/arabic-encoding',
      'docs/... لتوثيق: docs/setup-guide'
    ] },
    { type: 'p', text: 'الاسم الوصفي بيخلي `git branch` أشبه بقائمة مهام. وربط الـ branch بالـ issue (بكتابة رقمها في الرسايل أو الـ PR) بيخلي كل commit مفهوم السياق.' },
    { type: 'note', text: 'الأكاديميات الأربعة زمايلنا (SQL و Python و Excel و Power BI) كلها repos على GitHub بنفس الحساب، وأي تحسين فيها بيعدي بنفس الدورة دي. شوف github.com/capwv لو عايز أمثلة حية.' }
  ],
  quiz: [
    { q: 'إيه القاعدة الجوهرية في GitHub Flow؟', options: [
      { text: 'كل حاجة على main على طول عشان السرعة' },
      { text: 'محدش بيعمل commit على main مباشرة: كل تغيير بيعدي على branch و Pull Request' },
      { text: 'branch واحد بس لكل المشروع' }
    ], answer: 1, explain: 'الدورة: branch ← commits ← PR ← merge. كده main دايماً شغالة وكل تغيير متسجل ومراجع.' },
    { q: 'الـ issue على GitHub هي إيه؟', options: [
      { text: 'رسالة خطأ في الكود' },
      { text: 'بطاقة شغل: وصف مشكلة أو ميزة، ليها مسؤول ونقاش وحالة' },
      { text: 'ملف إعدادات للـ repo' }
    ], answer: 1, explain: 'الـ issues هي نظام إدارة الشغل المدمج في GitHub. بتنظم الأفكار والمشاكل قبل ما تتبرمج.' },
    { q: 'أنهي اسم branch أحسن لإصلاح مشكلة في ترميز العربي؟', options: [
      { text: 'branch2', mono: true },
      { text: 'fix/arabic-encoding', mono: true },
      { text: 'ahmed', mono: true }
    ], answer: 1, explain: 'الاسم الوصفي بيبدأ بالنوع (fix/feature/docs) وبيوصف الشغل. أي حد يشوف git branch يفهم فوراً كل برانش بتعمل إيه.' }
  ],
  exercises: [
    { task: 'على أي repo عندك على GitHub: افتح issue بعنوان ووصف حقيقيين (حتى لو تحسين بسيط)، وبعدين اقفلها من واجهة GitHub', code: `# خطوات من المتصفح:
# 1. افتح الـ repo ← تبويب Issues ← New issue
# 2. العنوان: Add usage examples to README
# 3. الوصف: الـ README محتاج أمثلة تشغيل خطوة بخطوة عشان المستخدم الجديد
# 4. Submit ← وبعدين Close issue لما تخلصها`, why: 'الـ issue الكويسة بتوصف "إيه المطلوب" مش بس "فيه مشكلة". تمرن على كتابتها بشكل احترافي من دلوقتي.' },
    { task: 'طبق دورة GitHub Flow كاملة على مشروعك: branch وصفي ← commit ← push الـ branch. (الـ PR نفسه موضوع الدرس الجاي)', code: `$ git switch -c docs/readme-examples
$ echo "## أمثلة الاستخدام" >> README.md
$ git add . && git commit -m "docs: add usage examples section"
$ git push -u origin docs/readme-examples
To https://github.com/you/first-repo.git
 * [new branch]      docs/readme-examples -> docs/readme-examples`, why: 'دفع الـ branch باسمه (مش main) هو قلب الدورة. GitHub هيقترح عليك فتح Pull Request فوراً، وده موضوعنا الجاي.' }
  ]
},
{
  id: 'pull-requests',
  nav: 'Pull Requests',
  title: 'الـ Pull Requests: باب المراجعة قبل الدمج',
  subtitle: 'إزاي تفتح PR، يتراجع، ويتدمج، وليه ده أهم عادة في الشغل الجماعي',
  blocks: [
    { type: 'p', text: 'الـ Pull Request (أو PR) هو طلب دمج رسمي: "خلصت شغل على الـ branch ده، عايز أدمجه في main، راجعوه الأول". هو المكان اللي بيحصل فيه النقاش والمراجعة (code review) قبل ما أي تعديل يلمس main.' },
    { type: 'h', text: 'فتح PR' },
    { type: 'list', items: [
      'ادفع الـ branch: git push -u origin feature/sales-chart.',
      'افتح الـ repo على GitHub: هتلاقي شريط أصفر بيقترح Compare & pull request.',
      'اكتب عنوان واضح ووصف: إيه اللي اتعمل وليه، وربط بالـ issue لو فيه (Closes #3).',
      'Create pull request.'
    ] },
    { type: 'p', text: 'صفحة الـ PR بتجمع كل حاجة: الوصف، قائمة الـ commits، والـ diff الكامل (Files changed) اللي بيوضح كل سطر اتضاف أو اتمسح.' },
    { type: 'h', text: 'المراجعة (Review)' },
    { type: 'p', text: 'المراجع بيقدر يعلق على سطر بعينه في الـ diff، يطلب تعديلات (Request changes)، أو يوافق (Approve). لو طلب تعديلات: انت بتعدل محلياً على نفس الـ branch وتعمل push، والـ PR بيتحدث لوحده. متفتحش PR جديد.' },
    { type: 'code', code: `# دورة التعديل بعد المراجعة:
$ git switch feature/sales-chart
# ... عدل الملفات المطلوبة ...
$ git add . && git commit -m "address review: rename column"
$ git push
# الـ PR اتحدث تلقائياً بالـ commit الجديدة` },
    { type: 'h', text: 'الدمج (Merge)' },
    { type: 'p', text: 'لما المراجعة تخلص، زرار Merge pull request بيدمج الـ branch في main (GitHub بيعمل merge commit). بعدها بيظهر زرار Delete branch: دوسه براحتك، الـ branch خلص دوره. محلياً اعمل `git pull` على main عشان تنزل الدمج.' },
    { type: 'list', items: [
      'Merge العادي: يحفظ كل commits الـ branch كما هي + merge commit. الأكثر شيوعاً.',
      'Squash and merge: يكبس كل commits الـ branch في commit واحدة نضيفة. كويس لما الـ commits وسط الشغل ملخبطة.',
      'Rebase and merge: يعيد كتابة commits الـ branch فوق main من غير merge commit. متقدم، سيبه لبعدين.'
    ] },
    { type: 'h', text: 'وانت لوحدك؟' },
    { type: 'p', text: 'حتى في مشروع شخصي، الـ PR بيديك فرصة تراجع الـ diff كامل قبل الدمج بعين مرتاحة. ناس كتير بتكتشف أغلاطها في شاشة Files changed قبل ما توصل main.' },
    { type: 'note', text: 'كتابة "Closes #7" في وصف الـ PR بتخلي GitHub يقفل الـ issue رقم 7 تلقائياً أول ما الـ PR يتدمج. ربط الشغل ببعضه بضغطة واحدة.' }
  ],
  quiz: [
    { q: 'الـ Pull Request هو إيه في جملة؟', options: [
      { text: 'طلب سحب الملفات من GitHub' },
      { text: 'طلب دمج branch في branch تاني مع مساحة مراجعة ونقاش قبل الدمج' },
      { text: 'طلب إذن عشان تعمل clone' }
    ], answer: 1, explain: 'الـ PR بيطلب دمج شغلك ويفتح باب مراجعة منظم: تعليقات على الأسطر، موافقة أو طلب تعديلات، وبعدين دمج موثق.' },
    { q: 'المراجع طلب تعديلات على الـ PR بتاعك. إيه الصح؟', options: [
      { text: 'افتح PR جديد بالتعديلات' },
      { text: 'عدل على نفس الـ branch واعمل push، والـ PR هيتحدث لوحده' },
      { text: 'امسح الـ branch وابدأ من الأول' }
    ], answer: 1, explain: 'الـ PR مربوط بالـ branch مش بلقطة منه. أي push جديد على نفس الـ branch بيظهر في نفس الـ PR فوراً.' },
    { q: 'Squash and merge بتعمل إيه؟', options: [
      { text: 'بتمسح الـ PR' },
      { text: 'بتكبس كل commits الـ branch في commit واحدة نضيفة على main' },
      { text: 'بتدمج من غير مراجعة' }
    ], answer: 1, explain: 'كويسة لما commits وسط الشغل ملخبطة (typo، fix، fix again). النتيجة commit واحدة واضحة في تاريخ main.' }
  ],
  exercises: [
    { task: 'من الـ branch اللي دفعته في تمرين الدرس اللي فات: افتح Pull Request حقيقي على GitHub، اكتب وصف فيه "Closes #1" (رقم الـ issue بتاعتك)، وادمجه Squash and merge', code: `# من المتصفح:
# 1. Compare & pull request على الـ branch docs/readme-examples
# 2. الوصف: "بيضيف أمثلة استخدام للـ README. Closes #1"
# 3. Create ← راجع تبويب Files changed
# 4. Merge pull request ← Confirm squash and merge
# 5. Delete branch`, why: 'أول PR ليك خطوة مفصلية. لاحظ إن الـ issue اتقفلت لوحدها بعد الدمج، وإن main بقى فيها commit واحدة نضيفة بكل الشغل.' },
    { task: 'بعد الدمج: رجع main محلياً، نزل التحديثات، امسح الـ branch المحلي، وتأكد من التاريخ', code: `$ git switch main
$ git pull
Updating a1b2c3d..f6g7h8i
Fast-forward
 README.md | 2 ++

$ git branch -d docs/readme-examples
Deleted branch docs/readme-examples (was 5c6d7e8).

$ git log --oneline
f6g7h8i docs: add usage examples section (#2)
a1b2c3d update README`, why: 'الدمج حصل على GitHub (الـ remote)، فلازم pull عشان يوصل جهازك. دي دورة هتتكرر مع كل PR: merge أونلاين ← pull محلي.' }
  ]
},
{
  id: 'readme',
  nav: 'الـ README وشكل المشروع',
  title: 'الـ README: واجهة مشروعك على GitHub',
  subtitle: 'Markdown الأساسي، وأقسام الـ README اللي بتخلي مشروعك يتفهم في دقيقة',
  blocks: [
    { type: 'p', text: 'أول ما حد يفتح الـ repo بتاعتك على GitHub، اللي بيشوفه هو ملف `README.md` معروض تحت قائمة الملفات. هو واجهة مشروعك: لو مش مكتوب كويس، محدش هيفهم مشروعك بيعمل إيه حتى لو الكود عبقري.' },
    { type: 'h', text: 'Markdown في 5 دقايق' },
    { type: 'p', text: 'ملفات `.md` بتتكتب بـ Markdown: رموز بسيطة بتتحول لعناوين وقوائم وأكواد. دي أهم العلامات:' },
    { type: 'code', code: `# عنوان رئيسي
## عنوان فرعي

نص عادي فيه **تخين** و *مائل* و \`كود سطري\`.

- نقطة أولى
- نقطة تانية

1. خطوة مرتبة
2. خطوة تانية

\`\`\`bash
git status
\`\`\`

[نص لينك](https://github.com/capwv)
| عمود 1 | عمود 2 |
|--------|--------|
| خلية   | خلية   |` },
    { type: 'h', text: 'الأقسام الأساسية لأي README' },
    { type: 'list', items: [
      'اسم المشروع وجملة واحدة بتوصفه.',
      'Features أو "بيعمل إيه": 3-5 نقط.',
      'التثبيت: أوامر جاهزة للنسخ واللصق.',
      'الاستخدام: مثال عملي سريع.',
      'لقطة شاشة لو المشروع له واجهة (صورة تساوي ألف وصف).',
      'الرخصة (License) لو المشروع عام.'
    ] },
    { type: 'h', text: 'مثال README صغير وكامل' },
    { type: 'code', code: `# Sales Dashboard

لوحة تحليل مبيعات بتعرض الإيرادات الشهرية وأعلى المنتجات.

## Features
- قراءة بيانات من CSV وتنضيفها
- رسوم بيانية تفاعلية
- تصدير تقرير PDF

## التثبيت
\`\`\`bash
git clone https://github.com/you/sales-dashboard.git
cd sales-dashboard
pip install -r requirements.txt
\`\`\`

## الاستخدام
\`\`\`bash
python dashboard.py --data sales.csv
\`\`\`` },
    { type: 'p', text: 'لاحظ: الأوامر جوه code blocks عشان تتنسخ بسهولة، والأقسام بعناوين `##`. README بهذا الحجم كافي جداً لمعظم المشاريع.' },
    { type: 'note', text: 'حركة GitHub لطيفة: ملف README جوه أي فولدر فرعي بيتعرض لما حد يفتح الفولدر ده. تقدر تشرح كل جزء من المشروع في مكانه.' },
    { type: 'p', text: 'عايز تتأكد شكل الـ Markdown هيطلع إزاي؟ واجهة تحرير الملفات على GitHub فيها تبويب Preview بيعرض النتيجة قبل الـ commit.' }
  ],
  quiz: [
    { q: 'إيه اللي بيعرضه GitHub تلقائياً في الصفحة الرئيسية للـ repo؟', options: [
      { text: 'أول ملف أبجدياً' },
      { text: 'ملف README.md' },
      { text: 'آخر ملف اتعدل' }
    ], answer: 1, explain: 'README.md في جذر الـ repo بيتعرض تحت قائمة الملفات. هو أول انطباع عن مشروعك.' },
    { q: 'في Markdown، إزاي بتعمل كود بلوك فيه أوامر؟', options: [
      { text: 'بعلامة واحدة ` في أول السطر' },
      { text: 'بتلات علامات ``` قبل الكود وبعده' },
      { text: 'بعلامة > في أول كل سطر' }
    ], answer: 1, explain: 'التلات backticks بتفتح وتقفل بلوك الكود، وتقدر تكتب اللغة بعدهم (```bash) للتلوين. العلامة الواحدة للكود السطري جوه الجملة.' },
    { q: 'أنهي قسم مش لازم يكون في README مبتدئ؟', options: [
      { text: 'وصف المشروع' },
      { text: 'طريقة التثبيت والاستخدام' },
      { text: 'تاريخ أسهم الشركة المالكة' }
    ], answer: 2, explain: 'الأساسيات: المشروع بيعمل إيه، إزاي يتسطب، إزاي يشتغل. الباقي (badges، مساهمة، رخصة) إضافات على حسب الحجم.' }
  ],
  exercises: [
    { task: 'اكتب README كامل لمشروعك الحالي بالأقسام الأساسية (وصف، features، تثبيت، استخدام)، واعمله commit و push وافتح الـ repo على GitHub وشوف النتيجة', code: `# افتح README.md في المحرر واكتب بالقالب اللي فوق،
# عدل المحتوى لمشروعك، وبعدين:

$ git add README.md
$ git commit -m "docs: write full README"
$ git push`, why: 'أحسن مراجعة للـ README هي إنك تفتح صفحة الـ repo وتحكم: هل حد مش عارف المشروع هيفهمه في دقيقة؟ لو لأ، زود أمثلة أو لقطة شاشة.' },
    { task: 'جرب تضيف جدول Markdown في الـ README (مثلاً جدول بأوامر المشروع ووصفها) وشوفه في Preview قبل الـ commit', code: `## الأوامر

| الأمر | الوظيفة |
|-------|---------|
| \`python dashboard.py\` | تشغيل اللوحة |
| \`python export.py\` | تصدير PDF |`, why: 'الجداول في Markdown سهلة وبتدي شكل احترافي فوري. الأعمدة بتتفصل بـ | وسطر الشرطات تحت العناوين إجباري.' }
  ]
},
{
  id: 'gitignore',
  nav: '.gitignore',
  title: '.gitignore: إيه اللي مش المفروض يترفع أبداً',
  subtitle: 'حماية الأسرار والملفات المؤقتة من الـ commits',
  blocks: [
    { type: 'p', text: 'مش كل ملف في مجلد الشغل مكانه في تاريخ المشروع. كلمات سر و API keys، ملفات مؤقتة، فولدرات المكتبات الضخمة (node_modules)، ملفات النظام (.DS_Store)، وقواعد بيانات محلية. ملف `.gitignore` بيقول لـ Git: الملفات دي اعمل نفسك مش شايفها.' },
    { type: 'h', text: 'إزاي بيشتغل' },
    { type: 'p', text: 'ملف اسمه بالظبط `.gitignore` في جذر الـ repo، كل سطر فيه نمط (pattern):' },
    { type: 'code', code: `# ملفات محددة
.env
secrets.txt

# امتدادات
*.log
*.tmp

# فولدرات كاملة
node_modules/
__pycache__/

# ملفات النظام
.DS_Store
Thumbs.db` },
    { type: 'p', text: 'أول ما تضيف النمط، Git بيبطل يعرض الملفات دي في `git status` و`git add .` بيتخطاها. النجمة `*` معناها "أي حاجة"، والشرطة المائلة الأخيرة معناها "فولدر".' },
    { type: 'h', text: 'الغلطة الكلاسيكية: ملف اترفع قبل ما تضيفه للـ gitignore' },
    { type: 'p', text: '`.gitignore` بيمنع التتبع الجديد بس. لو ملف متتبع خلاص (دخل في commit قبل كده)، إضافته للـ gitignore مش هتعمل حاجة. الحل: شيله من التتبع مع بقائه على جهازك:' },
    { type: 'code', code: `$ git rm --cached .env
rm '.env'

$ echo ".env" >> .gitignore
$ git add .gitignore
$ git commit -m "stop tracking .env"` },
    { type: 'note', warn: true, text: 'لو رفعت كلمة سر أو API key على GitHub (حتى لو شلتها بعدين بـ commit): اعتبرها مكشوفة وغيرها فوراً من حساب الخدمة نفسها. التاريخ محفوظ، وفيه bots بتمسح GitHub بحثاً عن مفاتيح مسربة خلال دقايق من الرفع.' },
    { type: 'h', text: 'قوالب جاهزة' },
    { type: 'p', text: 'مش لازم تكتب .gitignore من الصفر: GitHub نفسه بيقترح قالب حسب لغة مشروعك لما بتعمل repo جديدة، وموقع gitignore.io فيه قوالب جاهزة لأي تقنية (Python, Node, Excel temp files...). انسخ القالب وعدل عليه.' },
    { type: 'h', text: 'إيه اللي يدخل وإيه اللي لأ' },
    { type: 'table', head: ['يدخل الـ repo', 'ميدخلش'], rows: [
      ['الكود والسكريبتات', 'كلمات سر و API keys (.env)'],
      ['التوثيق و README', 'فولدرات المكتبات (node_modules)'],
      ['ملفات إعداد المشروع', 'ملفات مؤقتة و logs'],
      ['بيانات تجريبية صغيرة', 'بيانات كبيرة أو حساسة']
    ] }
  ],
  quiz: [
    { q: 'وظيفة ملف .gitignore؟', options: [
      { text: 'يمنع GitHub من عرض ملفات معينة' },
      { text: 'يخلي Git يتجاهل ملفات بأنماط معينة فمتدخلش في commits' },
      { text: 'يضغط الملفات الكبيرة' }
    ], answer: 1, explain: 'أنماط .gitignore بتشيل الملفات من status و add. الملف المهم مش بيتتبع من الأساس، فمش بيوصل التاريخ أبداً.' },
    { q: 'ملف .env اترفع في commit قديمة. إضافته لـ .gitignore هتحل المشكلة؟', options: [
      { text: 'أيوه، الملف هيتشال تلقائياً' },
      { text: 'لأ: لازم git rm --cached الأول، ولازم تغير كلمة السر نفسها لأن التاريخ محفوظ' },
      { text: 'لأ: مفيش أي حل' }
    ], answer: 1, explain: 'gitignore بيمنع التتبع الجديد بس. rm --cached بيشيل الملف من التتبع من غير ما يمسحه من جهازك، وكلمة السر المتسربة لازم تتغير من مصدرها.' },
    { q: 'النمط node_modules/ في .gitignore معناه إيه؟', options: [
      { text: 'تجاهل ملف اسمه node_modules' },
      { text: 'تجاهل الفولدر node_modules بكل محتواه' },
      { text: 'تجاهل أي فولدر فيه المكتبات' }
    ], answer: 1, explain: 'الشرطة المائلة الأخيرة معناها فولدر. النمط ده بيمنع آلاف ملفات المكتبات من تلويث الـ repo: أي حد هيعمل install هيجيبهم.' }
  ],
  exercises: [
    { task: 'أنشئ .gitignore مناسب لمشروع Python بيانات: تجاهل __pycache__ و .env و *.log و ملفات إكسل المؤقتة (~$*.xlsx)، وتأكد إن git status بقى نضيف', code: `$ cat > .gitignore << 'EOF'
__pycache__/
.env
*.log
~$*.xlsx
EOF

$ touch debug.log
$ git status
On branch main
Untracked files:
	.gitignore

nothing added to commit but untracked files present
# debug.log مش ظاهر: gitignore شغال`, why: 'علامة النجاح: الملفات المتجاهلة بتختفي من status تماماً. لو ظهرت، راجع النمط (إملاء، مسار، شرطة مائلة).' },
    { task: 'في المعمل: كمل سيناريو git rm --cached بنفسك: اعمل repo، ارفع ملف .env بغلط، شيله من التتبع، وضيفه للـ .gitignore', code: `$ git init && echo "SECRET=123" > .env
$ git add . && git commit -m "oops"
$ git rm --cached .env
rm '.env'
$ echo ".env" > .gitignore
$ git add .gitignore && git commit -m "stop tracking .env"
$ git status
On branch main
nothing to commit, working tree clean
$ cat .env
SECRET=123    # الملف لسه موجود على جهازك`, why: 'rm --cached بيشيل من التتبع بس مش من الديسك. دي الحركة اللي بتنقذك لما ترفع حاجة بغلط، وهي مجربة في المعمل بنفس السيناريو.' }
  ]
},
{
  id: 'undo',
  nav: 'التراجع عن الأغلاط',
  title: 'التراجع عن الأغلاط: restore و reset و revert',
  subtitle: 'خريطة القرار الكاملة: أنهي أمر يصلح أنهي غلطة من غير ما تضيع شغلك',
  blocks: [
    { type: 'p', text: 'الغلط في Git مش نهاية العالم: لكل غلطة أمر بيصلحها. المشكلة الوحيدة إن الأوامر دي متشابهة في الاسم ومختلفة في الخطورة، فخلينا نحط الخريطة مرة واحدة.' },
    { type: 'h', text: 'غلطة 1: عدلت ملف وعايز أرجعه زي ما كان' },
    { type: 'code', code: `$ git restore report.py` },
    { type: 'p', text: '`restore` بترجع الملف لنسخة آخر commit (أو لنسخة الـ staging مع --staged). التعديلات الغير محفوظة بتضيع: تأكد إنك فعلاً مش عايزها.' },
    { type: 'h', text: 'غلطة 2: عملت add لملف مش عايزه في الـ commit' },
    { type: 'code', code: `$ git restore --staged report.py` },
    { type: 'p', text: 'بيشيل الملف من الـ staging بس: تعديلاتك في مجلد الشغل زي ما هي، بس مش هتدخل الـ commit الجاية.' },
    { type: 'h', text: 'غلطة 3: عايز أرجع المشروع كله لنقطة قديمة (محلياً)' },
    { type: 'code', code: `$ git reset --hard HEAD~1
HEAD is now at 2112df3 update readme` },
    { type: 'list', items: [
      'reset --soft: يرجع مؤشر الـ branch بس، تعديلاتك كلها تفضل في الـ staging.',
      'reset --mixed (الافتراضي): يرجع المؤشر ويفضي الـ staging، تعديلاتك تفضل في مجلد الشغل.',
      'reset --hard: يرجع كل حاجة (المؤشر والـ staging ومجلد الشغل). التعديلات الغير محفوظة بتضيع نهائياً.'
    ] },
    { type: 'h', text: 'غلطة 4: commit غلط اترفعت على GitHub وعايز أتراجع عنها' },
    { type: 'code', code: `$ git revert HEAD
[main 372a609] Revert "c2"
 1 file changed, 1 deletion(-)` },
    { type: 'p', text: 'هنا الفرق المهم: `reset` بيمسح تاريخ (خطير لو الـ commits اترفعت وحد واخدها)، أما `revert` بيعمل commit جديدة بتعكس أثر القديمة من غير ما تلمس التاريخ. القاعدة: أي حاجة اترفعت على remote مشترك، التراجع عنها يكون بـ revert.' },
    { type: 'h', text: 'خريطة القرار' },
    { type: 'table', head: ['الغلطة', 'الحل'], rows: [
      ['تعديل في مجلد الشغل', 'git restore الملف'],
      ['ملف اتعمله add بالغلط', 'git restore --staged الملف'],
      ['آخر commit لسه محلية وعايز أعدل رسالتها', 'git commit --amend -m "الرسالة الصح"'],
      ['عايز أرجع لنقطة قديمة على جهازي', 'git reset --hard HEAD~N'],
      ['commit اترفعت وعايز أتراجع عنها', 'git revert HEAD ثم push']
    ] },
    { type: 'note', text: 'النجاة الحقيقية قبل كل دي: commits صغيرة ومتكررة. لما كل خطوة محفوظة في commit، أسوأ سيناريو إنك ترجع للخطوة اللي فاتت. اللي بيخسر شغل يوم كامل هو اللي مابيعملش commit غير آخر اليوم.' },
    { type: 'note', text: 'مهمة "التراجع عن غلطة" في المعمل بتحطك في الموقف: ملف اتعدل واتجهز بغلط، وتصلحه بـ restore --staged وبعدين restore. جربها.' }
  ],
  quiz: [
    { q: 'عدلت ملف وعايز تمسح التعديلات وترجعه لآخر commit:', options: [
      { text: 'git reset --hard HEAD~5', mono: true },
      { text: 'git restore الملف', mono: true },
      { text: 'git revert HEAD', mono: true }
    ], answer: 1, explain: 'restore بترجع الملف الواحد لنسخة آخر commit. reset --hard بيرجع المشروع كله (خطر زيادة هنا)، و revert للتراجع عن commits مش تعديلات.' },
    { q: 'commit غلط اترفعت على GitHub وزمايلك سحبوها. التراجع الآمن بـ:', options: [
      { text: 'git reset --hard HEAD~1 وبعدين push --force' },
      { text: 'git revert HEAD وبعدين push عادي' },
      { text: 'تمسح الـ repo وتعملها من جديد' }
    ], answer: 1, explain: 'revert بتعمل commit عكسية من غير ما تمسح التاريخ، فمتكسرش نسخ زمايلك. reset + force بيمسح commits الناس عندهم.' },
    { q: 'git restore --staged بتعمل إيه؟', options: [
      { text: 'بتمسح الملف من الجهاز' },
      { text: 'بتشيل الملف من الـ staging من غير ما تمسح تعديلاتك' },
      { text: 'بترجع آخر commit' }
    ], answer: 1, explain: 'بتلغي الـ add بس: الملف يخرج من الـ commit الجاية، وتعديلاتك تفضل في مجلد الشغل تعمل بيها اللي تريده.' }
  ],
  exercises: [
    { task: 'نفذ سلسلة التراجع الكاملة: عدل ملف، اعمله add، شيله من الـ staging بـ restore --staged، وبعدين ارجعه لآخر commit بـ restore', code: `$ echo "غلطة كبيرة لسه متسجلتش" >> README.md
$ git add README.md
$ git status    # staged

$ git restore --staged README.md
$ git status    # unstaged تاني

$ git restore README.md
$ git status
nothing to commit, working tree clean`, why: 'التسلسل ده هو السيناريو الأشهر في الحياة اليومية: "جهزت ملف بغلط". خطوتين وانت رجعت للنقطة النضيفة من غير أي خسارة.' },
    { task: 'جرب الفرق بين revert و reset: اعمل 2 commits، اعمل revert للتانية ولاحظ إن التاريخ زاد، وبعدين reset --hard ولاحظ إن التاريخ نقص', code: `$ git log --oneline
c2 update readme
c1 first commit

$ git revert HEAD
[main c3] Revert "update readme"
$ git log --oneline    # 3 commits: التاريخ زاد

$ git reset --hard HEAD~1
$ git log --oneline    # رجعنا c2: revert اختفت كأنها ما حصلتش`, why: 'revert بتحافظ على التاريخ (آمنة للشغل المشترك)، reset بتمسحه (للتنضيف المحلي بس). إحساس الفرق ده أهم من حفظه.' }
  ]
},
{
  id: 'capstone',
  nav: 'المشروع الختامي',
  title: 'المشروع الختامي: انشر أول موقع ليك على GitHub Pages',
  subtitle: 'من فولدر فاضي لموقع live على الإنترنت بـ Git و GitHub بس',
  blocks: [
    { type: 'p', text: 'كل اللي فات كان تجهيز للحظة دي. المشروع الختامي: هتبني صفحة بسيطة (CV أو معرض أعمال أو صفحة تعريفية)، تحطها في repo على GitHub، وتنشرها كموقع live على رابط عام بـ GitHub Pages. نفس التقنية اللي الأكاديمية دي نفسها منشورة بيها.' },
    { type: 'h', text: 'الخطوة 1: ابني الصفحة' },
    { type: 'code', code: `$ mkdir my-first-site && cd my-first-site
$ git init
$ git config user.name "اسمك"   # لو الجهاز جديد` },
    { type: 'p', text: 'اعمل ملف `index.html` بسيط بأي محتوى يمثلك. مثال بداية:' },
    { type: 'code', code: `<!DOCTYPE html>
<html lang="ar" dir="rtl">
<head>
  <meta charset="UTF-8">
  <title>موقعي الأول</title>
</head>
<body>
  <h1>أهلاً، أنا اسمك</h1>
  <p>ده أول موقع أنشره بنفسي بـ GitHub Pages.</p>
</body>
</html>` },
    { type: 'h', text: 'الخطوة 2: احفظ وارفع' },
    { type: 'code', code: `$ git add .
$ git commit -m "first version of my site"
# اعمل repo جديدة على GitHub اسمها my-first-site (فاضية، Public)
$ git remote add origin https://github.com/USERNAME/my-first-site.git
$ git push -u origin main` },
    { type: 'h', text: 'الخطوة 3: فعّل GitHub Pages' },
    { type: 'list', items: [
      'افتح الـ repo على GitHub → Settings → Pages (من القايمة الجانبية).',
      'تحت Source اختار Deploy from a branch.',
      'اختار البرانش main والفولدر / (root) واضغط Save.',
      'استنى دقيقة أو اتنين، ورجع لنفس الصفحة: هتلاقي الرابط https://USERNAME.github.io/my-first-site/'
    ] },
    { type: 'p', text: 'افتح الرابط: موقعك live على الإنترنت، مجاناً، ومتاح لأي حد. كل push جديد على main بيحدث الموقع تلقائياً خلال دقيقة.' },
    { type: 'h', text: 'الخطوة 4: دورة التحديث' },
    { type: 'code', code: `# عدل الصفحة، وبعدين:
$ git add .
$ git commit -m "update intro text"
$ git push
# بعد دقيقة: الموقع اتحدث لوحده` },
    { type: 'h', text: 'معايير التسليم' },
    { type: 'list', items: [
      'الموقع شغال على رابط github.io بتاعك.',
      'الـ repo عليها README فيه وصف الموقع ولينك النسخة المنشورة.',
      '3 commits على الأقل برسايل واضحة (إصدار أول، تحسين، إضافة).',
      'تعديل واحد على الأقل تم عن طريق branch و Pull Request مدموج.'
    ] },
    { type: 'note', text: 'نشرت أول موقع؟ مبروك، دي نفس خطوات نشر كل أكاديميات المنصة دي. شارك اللينك، وابدأ فكر: إيه اللي ممكن تبنيه كمشروع تاني؟' }
  ],
  quiz: [],
  exercises: [
    { task: 'نفذ المشروع الختامي كله من الأول للآخر: صفحة HTML ← repo ← push ← تفعيل Pages ← فتح الرابط المنشور', code: `# المسار الكامل بالترتيب:
git init
echo "<h1>أهلاً بالعالم</h1>" > index.html
git add . && git commit -m "first version"
git remote add origin https://github.com/USERNAME/my-first-site.git
git push -u origin main
# Settings → Pages → Deploy from a branch → main → Save
# افتح https://USERNAME.github.io/my-first-site/`, why: 'المعيار النهائي واحد: الرابط بيفتح موقعك في متصفح أي حد. لو فتح، انت خلاص ناشر. لو 404، استنى دقيقتين وتأكد إن Pages متفعلة على main / (root).' },
    { task: 'زود تحسين على موقعك باستخدام دورة GitHub Flow الكاملة: branch ← commit ← push ← Pull Request ← merge', code: `$ git switch -c feature/add-about
# عدل index.html وأضف قسم "عني"
$ git add . && git commit -m "add about section"
$ git push -u origin feature/add-about
# افتح PR على GitHub، راجع الـ diff، ادمجه، وامسح الـ branch
$ git switch main && git pull`, why: 'الموقع هيتحدث بعد الدمج خلال دقيقة. كده طبقت كل اللي اتعلمته في مشروع حقيقي منشور: branches و PR و Pages في دورة واحدة.' }
  ]
}
);
