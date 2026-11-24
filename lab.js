/* معمل Git التفاعلي — part 3: parser, shell builtins, missions, terminal UI */
(function (global) {
'use strict';
var C = global.GIT_CORE1;
var H = global.GIT_HANDLERS;
var U = global.GIT_CMD_UTIL;

/* ---------- tokenizer (quotes aware) ---------- */
function tokenize(line) {
  var toks = [], cur = '', q = null, i;
  for (i = 0; i < line.length; i++) {
    var ch = line[i];
    if (q) {
      if (ch === q) q = null;
      else cur += ch;
    } else if (ch === '"' || ch === "'") q = ch;
    else if (/\s/.test(ch)) { if (cur !== '') { toks.push(cur); cur = ''; } }
    else if (ch === '>' ) {
      if (cur !== '') { toks.push(cur); cur = ''; }
      if (line[i + 1] === '>') { toks.push('>>'); i++; } else toks.push('>');
    } else cur += ch;
  }
  if (cur !== '') toks.push(cur);
  return toks;
}

/* ---------- command registry (for help + hero stat) ---------- */
var COMMANDS = [
  ['git init','يعمل repo جديد في الفولدر'],
  ['git config','يظبط اسمك وإيميلك وإعدادات Git'],
  ['git status','يعرض حالة الملفات والـ staging'],
  ['git add','ينقل ملفات للـ staging area'],
  ['git commit','يحفظ نسخة جديدة برسالة'],
  ['git log','يعرض تاريخ الـ commits'],
  ['git show','يعرض تفاصيل commit معين'],
  ['git diff','يعرض الفروقات بين النسخ'],
  ['git branch','يعرض أو ينشئ أو يمسح branches'],
  ['git switch','ينقلك بين الـ branches'],
  ['git checkout','بديل switch، وبيرجع ملفات كمان'],
  ['git merge','يدمج branch في branch'],
  ['git reset','يرجع الـ HEAD لنقطة سابقة'],
  ['git restore','يرجع ملفات أو يفضي الـ staging'],
  ['git revert','يعمل commit بتلغي commit قديم'],
  ['git remote','يدير روابط الـ repos البعيدة'],
  ['git fetch','يجيب آخر حالة من GitHub من غير دمج'],
  ['git pull','fetch + merge في خطوة واحدة'],
  ['git push','يرفع commits المحلية على GitHub'],
  ['git clone','ينسخ repo من GitHub لجهازك'],
  ['git rm','يمسح ملف من Git'],
  ['ls','يعرض الملفات'],
  ['cat <file>','يطبع محتوى ملف'],
  ['echo "نص" > <file>','يكتب أو يعدل ملف (>> للإضافة)'],
  ['touch <file>','ينشئ ملف فاضي'],
  ['rm <file>','يمسح ملف من الفولدر'],
  ['pwd','يعرض مكانك'],
  ['clear','يمسح شاشة الترمنال'],
  ['help','القايمة دي']
];

/* ---------- shell builtins ---------- */
function shellBuiltin(s, toks) {
  var cmd = toks[0], args = toks.slice(1);
  if (cmd === 'ls') {
    var ks = Object.keys(s.files).sort();
    return ks.length ? [{ text: ks.join('   '), cls: '' }] : [{ text: '(فولدر فاضي)', cls: 't-dim' }];
  }
  if (cmd === 'cat') {
    if (!args[0]) return [{ text: 'usage: cat <file>', cls: 't-err' }];
    if (s.files[args[0]] === undefined) return [{ text: 'cat: ' + args[0] + ': No such file or directory', cls: 't-err' }];
    return s.files[args[0]].split('\n').map(function (l) { return { text: l, cls: '' }; });
  }
  if (cmd === 'echo') {
    var gi = args.findIndex(function (a) { return a === '>' || a === '>>'; });
    if (gi === -1) return [{ text: args.join(' '), cls: '' }];
    var text = args.slice(0, gi).join(' ');
    var file = args[gi + 1];
    if (!file) return [{ text: 'bash: syntax error near unexpected token', cls: 't-err' }];
    if (args[gi] === '>>' && s.files[file] !== undefined && s.files[file] !== '') s.files[file] += '\n' + text;
    else s.files[file] = text;
    return [];
  }
  if (cmd === 'touch') {
    if (!args[0]) return [{ text: 'usage: touch <file>', cls: 't-err' }];
    if (s.files[args[0]] === undefined) s.files[args[0]] = '';
    return [];
  }
  if (cmd === 'rm') {
    if (!args[0]) return [{ text: 'usage: rm <file>', cls: 't-err' }];
    if (s.files[args[0]] === undefined) return [{ text: 'rm: ' + args[0] + ': No such file or directory', cls: 't-err' }];
    delete s.files[args[0]];
    return [];
  }
  if (cmd === 'pwd') return [{ text: '/home/student/' + s.dirName, cls: '' }];
  return null;
}

var HELP_TEXT = COMMANDS.map(function (c) { return { text: '  ' + c[0] + '  —  ' + c[1], cls: 't-dim' }; });

/* ---------- dispatcher ---------- */
function runLine(s, line) {
  var toks = tokenize(line.trim());
  if (!toks.length) return { lines: [] };
  var cmd = toks[0], args = toks.slice(1);
  if (cmd === 'help') return { lines: [{ text: 'الأوامر المدعومة في المعمل:', cls: 't-hint' }].concat(HELP_TEXT) };
  if (cmd === 'clear') return { lines: [], clear: true };
  if (cmd === 'git') {
    var sub = args[0], rest = args.slice(1);
    if (sub && H[sub]) {
      try { return { lines: H[sub](s, rest) }; }
      catch (e) { return { lines: [{ text: 'خطأ داخلي في المحاكي: ' + e.message, cls: 't-err' }] }; }
    }
    if (!sub) return { lines: [{ text: "usage: git <command> — جرب: init, status, add, commit, log, branch, merge, push ...", cls: 't-dim' }] };
    return { lines: [{ text: "git: '" + sub + "' is not a git command. See 'git --help' أو اكتب help.", cls: 't-err' }] };
  }
  var sh = shellBuiltin(s, toks);
  if (sh) return { lines: sh };
  return { lines: [{ text: 'bash: ' + cmd + ': command not found — اكتب help لقايمة الأوامر', cls: 't-err' }] };
}

/* ---------- missions ---------- */
var MISSIONS = [
  { id: 'identity', title: 'عرّف Git مين انت',
    desc: 'قبل أي commit، Git محتاج يعرف اسمك وإيميلك عشان يمضي شغلك بيهم.',
    hint: 'git config --global user.name "اسمك" ثم git config --global user.email "you@example.com"',
    check: function (s) { return !!(s.config['user.name'] && s.config['user.email']); } },
  { id: 'first-commit', title: 'أول repo وأول commit',
    desc: 'اعمل git init، أنشئ ملف (مثلاً echo "# My Project" > README.md)، ضيفه بـ git add، واحفظه بـ git commit -m "first commit".',
    hint: 'git init ← echo "# My Project" > README.md ← git add README.md ← git commit -m "first commit"',
    check: function (s) { return s.initialized && s.commits.length >= 1; } },
  { id: 'cycle', title: 'دورة التعديل الكاملة',
    desc: 'عدّل أي ملف (echo "سطر جديد" >> README.md) وبعدين add و commit تاني. راقب git status قبل وبعد.',
    hint: 'echo "تعديل" >> README.md ← git add . ← git commit -m "update readme"',
    check: function (s) { return s.commits.length >= 2; } },
  { id: 'branch', title: 'اعمل branch وانتقل ليه',
    desc: 'الشغل الجديد بيتعمل على branch لوحده. اعمل branch باسم feature وانتقل ليه بأمر واحد.',
    hint: 'git switch -c feature',
    check: function (s) { return s.HEAD.branch && s.HEAD.branch !== 'main'; } },
  { id: 'branch-commit', title: 'commit على الـ feature branch',
    desc: 'اعمل تعديل و commit وانت على feature. لاحظ إن main فضل مكانه: git log --oneline على كل branch.',
    hint: 'echo "ميزة جديدة" > feature.txt ← git add . ← git commit -m "add feature"',
    check: function (s) {
      if (!s.HEAD.branch || s.HEAD.branch === 'main') return false;
      var ok = !C.isAncestor(s, C.headId(s), s.branches.main);
      if (ok) s._mBranch = s.HEAD.branch;
      return ok;
    } },
  { id: 'merge', title: 'ارجع main وادمج شغلك',
    desc: 'ارجع لـ main واعمل git merge للـ branch بتاعك. لو main ماتحركش، هتشوف Fast-forward.',
    hint: 'git switch main ← git merge feature',
    check: function (s) {
      var b = s._mBranch || 'feature';
      return s.HEAD.branch === 'main' && s.branches[b] && C.isAncestor(s, s.branches[b], s.branches.main);
    } },
  { id: 'conflict', title: 'حل conflict من غير زعر',
    desc: 'جهزنا لك سيناريو: انت وزميلك عدلتوا نفس السطر. اعمل git merge hotfix، افتح الملف المتعارض، اختار المحتوى الصح (echo "الحل" > الملف)، بعدين add و commit.',
    hint: 'git merge hotfix ← cat README.md ← echo "الحل النهائي" > README.md ← git add README.md ← git commit -m "resolve conflict"',
    setup: function (s, run) {
      if (!s.branches.main) return;
      var f = Object.keys(C.treeAt(s, s.branches.main))[0] || 'README.md';
      s._conflictFile = f;
      run('git switch -c hotfix');
      run('echo "نسخة زميلك من ' + f + '" > ' + f);
      run('git add ' + f);
      run('git commit -m "hotfix: تعديل ' + f + '"');
      run('git switch main');
      run('echo "نسختك انت من ' + f + '" > ' + f);
      run('git add ' + f);
      run('git commit -m "update ' + f + ' على main"');
    },
    check: function (s) {
      return !s.merging && s.commits.some(function (c) { return c.parents.length === 2; });
    } },
  { id: 'remote', title: 'اربط GitHub واعمل أول push',
    desc: 'اعمل repo فاضي على GitHub (أو تخيله هنا)، اربطه بـ git remote add origin https://github.com/you/first-repo.git وارفع main.',
    hint: 'git remote add origin https://github.com/you/first-repo.git ← git push -u origin main',
    check: function (s) {
      return !!(s.remoteRepo && s.remoteRepo.branches.main && s.remoteRepo.branches.main === s.branches.main && s.upstream.main);
    } },
  { id: 'pull', title: 'زميلك رفع تعديل: هاته',
    desc: 'في commit جديد ظهر على GitHub (زميلك عمل push). هاته بـ git pull ولاحظ الـ Fast-forward في الـ log.',
    hint: 'git pull',
    setup: function (s) {
      if (!s.remoteRepo || !s.remoteRepo.branches.main) return;
      var base = s.remoteRepo.branches.main;
      var t = C.treeAt(s, base);
      t['TEAM-NOTES.md'] = '# ملاحظات الفريق\nدي إضافة من زميلك على GitHub مباشرة.';
      var c = C.makeCommit(s, 'Add team notes (from GitHub web)', t, [base]);
      s.remoteRepo.branches.main = c.id;
      s._remoteCommit = c.id;
    },
    check: function (s) {
      return !!(s._remoteCommit && C.isAncestor(s, s._remoteCommit, s.branches.main || ''));
    } },
  { id: 'undo', title: 'التراجع عن الغلط',
    desc: 'بيلعب في ملفاتك غلطة متخزنة في الـ staging وتعديل تاني غلط في مجلد الشغل. فضّي الـ staging بـ git restore --staged وارجع الملف بـ git restore.',
    hint: 'git restore --staged README.md ← git restore README.md (و git status يتأكد)',
    setup: function (s, run) {
      var f = Object.keys(s.files)[0] || 'README.md';
      s._undoFile = f;
      s._undoCommits = s.commits.length;
      run('echo "غلطة كبيرة لسه متسجلتش" >> ' + f);
      run('git add ' + f);
      run('echo "غلطة تانية مش متسجلة" >> ' + f);
    },
    check: function (s) {
      var f = s._undoFile;
      if (!f) return false;
      var ht = (function(){ var h=C.headId(s); return h?C.treeAt(s,h):{}; })();
      return s.files[f] === ht[f] && Object.keys(s.index).length === 0 && s.commits.length === s._undoCommits;
    } },
  { id: 'clone', title: 'اعمل clone لمشروع من GitHub',
    desc: 'جرب تنزل مشروع جاهز: git clone https://github.com/infinity-team/demo-project.git — المحاكي هيبدأ مشهد جديد فيه المشروع المنزل (شغلك القديم بيتستبدل، زي فتح فولدر جديد).',
    hint: 'git clone https://github.com/infinity-team/demo-project.git ← git log --oneline',
    check: function (s) { return s.dirName === 'demo-project' && s.initialized && !!s.remoteRepo; } }
];

global.GIT_LAB_META = { commands: COMMANDS.length, missions: MISSIONS.length };

/* ---------- terminal UI (browser only) ---------- */
if (typeof document === 'undefined') {
  global.GIT_LAB = { runLine: runLine, MISSIONS: MISSIONS, COMMANDS: COMMANDS };
  return;
}

var LAB_KEY = 'git-zero-lab-v1';
var sim = C.freshState();
var missionsDone = {};
var missionsSetup = {};
var outEl = document.getElementById('term-out');
var stateEl = document.getElementById('git-state');
var inEl = document.getElementById('term-in');
var formEl = document.getElementById('term-form');
var missionsPanel = document.getElementById('missions-panel');

function save() {
  try {
    localStorage.setItem(LAB_KEY, JSON.stringify({ sim: sim, missionsDone: missionsDone, missionsSetup: missionsSetup }));
  } catch (e) {}
}
function load() {
  try {
    var raw = localStorage.getItem(LAB_KEY);
    if (!raw) return;
    var d = JSON.parse(raw);
    if (d && d.sim && d.sim.dirName) { sim = d.sim; missionsDone = d.missionsDone || {}; missionsSetup = d.missionsSetup || {}; }
  } catch (e) {}
}

function promptText() {
  var b = sim.initialized ? (sim.HEAD.branch || ('HEAD@' + U.short(C.headId(sim) || '?'))) : null;
  return '~/' + sim.dirName + (b ? ' (' + b + ')' : '') + ' $';
}
function esc(s) { return String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;'); }
function printLines(lines) {
  lines.forEach(function (l) {
    var div = document.createElement('div');
    if (l.cls) div.className = l.cls;
    div.textContent = l.text;
    outEl.appendChild(div);
  });
  outEl.scrollTop = outEl.scrollHeight;
}
function echoCmd(line) {
  var div = document.createElement('div');
  div.innerHTML = '<span class="t-prompt">' + esc(promptText()) + '</span> <span class="t-cmd">' + esc(line) + '</span>';
  outEl.appendChild(div);
}

function currentMission() {
  for (var i = 0; i < MISSIONS.length; i++) if (!missionsDone[MISSIONS[i].id]) return MISSIONS[i];
  return null;
}

function renderState() {
  var html = '';
  html += '<h4>الحالة</h4>';
  if (!sim.initialized) {
    html += '<div class="gs-dim">لسه مفيش repo — اكتب git init</div>';
  } else {
    var h = C.headId(sim);
    html += '<div>HEAD ← <span class="gs-head">' + esc(sim.HEAD.branch || ('detached @ ' + U.short(h))) + '</span></div>';
    if (sim.merging) html += '<div class="gs-mod">MERGING! في conflict لسه متحلش</div>';
    html += '<h4 style="margin-top:10px">Branches</h4>';
    Object.keys(sim.branches).sort().forEach(function (b) {
      html += '<div><span class="' + (b === sim.HEAD.branch ? 'gs-head' : 'gs-branch') + '">' + (b === sim.HEAD.branch ? '* ' : '  ') + esc(b) + '</span> <span class="gs-id">' + U.short(sim.branches[b]) + '</span></div>';
    });
    Object.keys(sim.remoteBranches).forEach(function (b) {
      html += '<div class="t-dim">  ' + esc(b) + ' <span class="gs-id">' + U.short(sim.remoteBranches[b]) + '</span></div>';
    });
    if (h) {
      html += '<h4 style="margin-top:10px">آخر Commits</h4>';
      var id = h, n = 0;
      while (id && n++ < 6) {
        var c = C.commitById(sim, id);
        html += '<div class="gs-commit">* <span class="gs-id">' + U.short(id) + '</span> ' + esc(c.msg) + '</div>';
        id = c.parents[0];
      }
    }
  }
  html += '<h4 style="margin-top:10px">الملفات</h4>';
  var ht = sim.initialized ? (function(){ var hd=C.headId(sim); return hd?C.treeAt(sim,hd):{}; })() : {};
  var paths = {};
  [sim.files, sim.index, ht].forEach(function (m) { Object.keys(m).forEach(function (p) { paths[p] = 1; }); });
  var ks = Object.keys(paths).sort();
  if (!ks.length) html += '<div class="t-dim">(فاضي)</div>';
  ks.forEach(function (p) {
    var w = sim.files[p], idx = sim.index[p], cm = ht[p];
    var cls = 'gs-file', tag = '';
    if (sim.merging && sim.merging.conflicts.indexOf(p) !== -1) { cls = 'gs-mod'; tag = ' ⚡conflict'; }
    else if (w === undefined && cm !== undefined) { cls = 'gs-mod'; tag = ' محذوف'; }
    else if (w !== undefined && cm === undefined && idx === undefined) { cls = 'gs-unt'; tag = ' جديد (untracked)'; }
    else if (idx !== undefined && !idx.deleted && idx !== cm) { cls = 'gs-staged'; tag = ' في الـ staging'; }
    else if (w !== undefined && w !== cm) { cls = 'gs-mod'; tag = ' متعدل'; }
    html += '<div class="' + cls + '">  ' + esc(p) + '<span class="t-dim">' + tag + '</span></div>';
  });
  stateEl.innerHTML = html;
}

function renderMissions() {
  var cur = currentMission();
  var done = Object.keys(missionsDone).length;
  var html = '<div class="mission"><div class="m-title">🎯 مهام التدريب (' + done + '/' + MISSIONS.length + ')</div></div>';
  MISSIONS.forEach(function (m) {
    var isDone = !!missionsDone[m.id];
    var isCur = cur && cur.id === m.id;
    html += '<div class="mission' + (isDone ? ' done' : '') + '"' + (isCur ? ' style="border-color:rgba(122,167,255,.6)"' : '') + '>' +
      '<div class="m-title">' + (isDone ? '<span class="m-check">✓</span>' : '') + esc(m.title) + '</div>' +
      (isCur || !isDone ? '<p>' + esc(m.desc) + '</p><div class="m-hint">💡 ' + esc(m.hint) + '</div>' : '') +
      '</div>';
  });
  missionsPanel.innerHTML = html;
}

function afterCommand() {
  var m = currentMission();
  if (m) {
    if (m.setup && !missionsSetup[m.id]) {
      missionsSetup[m.id] = true;
      m.setup(sim, function (line) { runLine(sim, line); });
      printLines([{ text: '', cls: '' }, { text: '🎯 مهمة جديدة: ' + m.title, cls: 't-hint' }, { text: m.desc, cls: 't-dim' }]);
    }
    if (m.check(sim)) {
      missionsDone[m.id] = true;
      printLines([{ text: '✅ برافو! خلصت المهمة: ' + m.title, cls: 't-ok' }]);
      var nxt = currentMission();
      if (nxt && nxt.setup && !missionsSetup[nxt.id]) {
        missionsSetup[nxt.id] = true;
        nxt.setup(sim, function (line) { runLine(sim, line); });
        printLines([{ text: '🎯 المهمة اللي بعدها: ' + nxt.title, cls: 't-hint' }, { text: nxt.desc, cls: 't-dim' }]);
      } else if (nxt) {
        printLines([{ text: '🎯 المهمة اللي بعدها: ' + nxt.title, cls: 't-hint' }, { text: nxt.desc, cls: 't-dim' }]);
      } else {
        printLines([{ text: '🏆 خلصت كل مهام التدريب! الوضع الحر مفتوح لك: جرب أي حاجة.', cls: 't-ok' }]);
      }
    }
  }
  renderState();
  renderMissions();
  save();
}

formEl.addEventListener('submit', function (ev) {
  ev.preventDefault();
  var line = inEl.value.trim();
  if (!line) return;
  echoCmd(line);
  inEl.value = '';
  var res = runLine(sim, line);
  if (res.clear) outEl.innerHTML = '';
  else printLines(res.lines);
  afterCommand();
});
document.getElementById('term').addEventListener('click', function () { inEl.focus(); });

document.getElementById('reset-lab').addEventListener('click', function () {
  sim = C.freshState();
  missionsSetup = {};
  outEl.innerHTML = '';
  bootText();
  renderState(); save();
  inEl.focus();
});
document.getElementById('missions-toggle').addEventListener('click', function () {
  missionsPanel.hidden = !missionsPanel.hidden;
  if (!missionsPanel.hidden) renderMissions();
});

function bootText() {
  printLines([
    { text: 'أهلاً بيك في معمل Git التفاعلي 👋', cls: 't-hint' },
    { text: 'المجلد الحالي: ~/' + sim.dirName + ' — لسه مش repo.', cls: 't-dim' },
    { text: 'اكتب help لقايمة الأوامر، أو ابدأ بمهام التدريب من الزرار فوق.', cls: 't-dim' }
  ]);
  var m = currentMission();
  if (m) printLines([{ text: '🎯 مهمتك الحالية: ' + m.title + ' — ' + m.desc, cls: 't-hint' }]);
}

global.GIT_LAB_FOCUS = function () { inEl.focus(); };

load();
bootText();
renderState();
renderMissions();

global.GIT_LAB = { runLine: runLine, MISSIONS: MISSIONS, COMMANDS: COMMANDS };
})(typeof window !== 'undefined' ? window : globalThis);
