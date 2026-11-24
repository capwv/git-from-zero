/* معمل Git التفاعلي — simulator core part 1: utils + state (no DOM, testable in node) */
(function (global) {
'use strict';

function fnv(str) {
  var h = 0x811c9dc5;
  for (var i = 0; i < str.length; i++) {
    h ^= str.charCodeAt(i);
    h = (h * 0x01000193) >>> 0;
  }
  return ('0000000' + h.toString(16)).slice(-8);
}
function clone(o) { return JSON.parse(JSON.stringify(o)); }

/* LCS line diff: returns ops [{t:'='|'-'|'+', line}] */
function diffLines(a, b) {
  var n = a.length, m = b.length;
  var dp = [];
  var i, j;
  for (i = 0; i <= n; i++) { dp.push(new Array(m + 1).fill(0)); }
  for (i = n - 1; i >= 0; i--) {
    for (j = m - 1; j >= 0; j--) {
      dp[i][j] = a[i] === b[j] ? dp[i + 1][j + 1] + 1 : Math.max(dp[i + 1][j], dp[i][j + 1]);
    }
  }
  var ops = [];
  i = 0; j = 0;
  while (i < n && j < m) {
    if (a[i] === b[j]) { ops.push({ t: '=', line: a[i] }); i++; j++; }
    else if (dp[i + 1][j] >= dp[i][j + 1]) { ops.push({ t: '-', line: a[i] }); i++; }
    else { ops.push({ t: '+', line: b[j] }); j++; }
  }
  while (i < n) { ops.push({ t: '-', line: a[i] }); i++; }
  while (j < m) { ops.push({ t: '+', line: b[j] }); j++; }
  return ops;
}

/* changed hunks of other vs base: [{b0,b1,newLines}] (base line range -> replacement) */
function hunks(base, other) {
  var ops = diffLines(base, other);
  var hs = [];
  var bi = 0, cur = null;
  ops.forEach(function (op) {
    if (op.t === '=') {
      if (cur) { hs.push(cur); cur = null; }
      bi++;
    } else {
      if (!cur) cur = { b0: bi, b1: bi, newLines: [] };
      if (op.t === '-') { cur.b1++; bi++; }
      else cur.newLines.push(op.line);
    }
  });
  if (cur) hs.push(cur);
  return hs;
}

/* reconstruct side lines over base range [u0,u1) using that side's hunks inside the range */
function applyRange(bl, hs, u0, u1) {
  var res = [], k = u0, x = 0;
  while (x < hs.length && hs[x].b0 < u1) {
    for (var q = k; q < hs[x].b0; q++) res.push(bl[q]);
    res = res.concat(hs[x].newLines);
    k = hs[x].b1; x++;
  }
  for (var q2 = k; q2 < u1; q2++) res.push(bl[q2]);
  return res;
}

/* 3-way merge of file maps. Returns {clean, files:{path:{content,conflict}}, conflicts:[path], theirsLabel} */
function merge3(baseFiles, ourFiles, theirFiles, theirsLabel) {
  var label = theirsLabel || 'theirs';
  var paths = {};
  [baseFiles, ourFiles, theirFiles].forEach(function (f) {
    Object.keys(f).forEach(function (p) { paths[p] = 1; });
  });
  var files = {}, conflicts = [];
  Object.keys(paths).sort().forEach(function (p) {
    var b = baseFiles[p], o = ourFiles[p], t = theirFiles[p];
    if (o === t) { if (o !== undefined) files[p] = { content: o }; return; }
    if (b === o) { if (t !== undefined) files[p] = { content: t }; return; } /* only theirs touched */
    if (b === t) { if (o !== undefined) files[p] = { content: o }; return; } /* only ours touched */
    if (b === undefined || o === undefined || t === undefined) {
      /* added in both differently, or changed vs deleted */
      files[p] = { content: '<<<<<<< HEAD\n' + (o || '') + '\n=======\n' + (t || '') + '\n>>>>>>> ' + label, conflict: true };
      conflicts.push(p);
      return;
    }
    var bl = b.split('\n');
    var ho = hunks(bl, o.split('\n')), ht = hunks(bl, t.split('\n'));
    var out = [], i = 0, io = 0, it = 0, conflict = false;
    while (io < ho.length || it < ht.length) {
      var no = ho[io], nt = ht[it];
      if (no && nt && no.b0 < nt.b1 && nt.b0 < no.b1) {
        /* overlapping edits: grow union range */
        var u0 = Math.min(no.b0, nt.b0);
        var u1 = Math.max(no.b1, nt.b1);
        var so = io, st = it, moved = true;
        while (moved) {
          moved = false;
          while (io < ho.length && ho[io].b0 < u1) { u1 = Math.max(u1, ho[io].b1); io++; moved = true; }
          while (it < ht.length && ht[it].b0 < u1) { u1 = Math.max(u1, ht[it].b1); it++; moved = true; }
        }
        for (var q = i; q < u0; q++) out.push(bl[q]);
        var oursR = applyRange(bl, ho.slice(so, io), u0, u1);
        var theirsR = applyRange(bl, ht.slice(st, it), u0, u1);
        if (oursR.join('\n') === theirsR.join('\n')) out = out.concat(oursR);
        else {
          conflict = true;
          out.push('<<<<<<< HEAD'); out = out.concat(oursR);
          out.push('======='); out = out.concat(theirsR);
          out.push('>>>>>>> ' + label);
        }
        i = u1;
      } else if (no && (!nt || no.b0 <= nt.b0)) {
        for (var q2 = i; q2 < no.b0; q2++) out.push(bl[q2]);
        out = out.concat(no.newLines); i = no.b1; io++;
      } else if (nt) {
        for (var q3 = i; q3 < nt.b0; q3++) out.push(bl[q3]);
        out = out.concat(nt.newLines); i = nt.b1; it++;
      }
    }
    for (var q4 = i; q4 < bl.length; q4++) out.push(bl[q4]);
    files[p] = { content: out.join('\n'), conflict: conflict };
    if (conflict) conflicts.push(p);
  });
  return { clean: conflicts.length === 0, files: files, conflicts: conflicts };
}

/* ---------- state ---------- */
function freshState() {
  return {
    initialized: false,
    dirName: 'my-project',
    files: {},
    index: {},
    commits: [],
    branches: {},
    HEAD: { branch: null },
    remotes: {},
    upstream: {},
    remoteBranches: {},
    remoteRepo: null,
    merging: null,
    config: { 'user.name': '', 'user.email': '' },
    seq: 1
  };
}
function headId(s) {
  if (s.HEAD.branch) return s.branches[s.HEAD.branch] || null;
  return s.HEAD.detached || null;
}
function commitById(s, id) {
  for (var i = 0; i < s.commits.length; i++) if (s.commits[i].id === id) return s.commits[i];
  return null;
}
function isAncestor(s, anc, desc) {
  if (!anc || !desc) return false;
  var seen = {}, stack = [desc];
  while (stack.length) {
    var id = stack.pop();
    if (id === anc) return true;
    if (seen[id]) continue;
    seen[id] = 1;
    var c = commitById(s, id);
    if (c) c.parents.forEach(function (p) { stack.push(p); });
  }
  return false;
}
function mergeBase(s, a, b) {
  var ancA = {}, stack = [a];
  while (stack.length) {
    var id = stack.pop();
    if (ancA[id]) continue; ancA[id] = 1;
    var c = commitById(s, id);
    if (c) c.parents.forEach(function (p) { stack.push(p); });
  }
  var queue = [b], seen = {};
  while (queue.length) {
    var id2 = queue.shift();
    if (ancA[id2]) return id2;
    if (seen[id2]) continue; seen[id2] = 1;
    var c2 = commitById(s, id2);
    if (c2) c2.parents.forEach(function (p) { queue.push(p); });
  }
  return null;
}
function treeAt(s, id) {
  var c = commitById(s, id);
  return c ? clone(c.tree) : {};
}
function makeCommit(s, msg, tree, parents) {
  var id = fnv(msg + JSON.stringify(tree) + parents.join(',') + ':' + (s.seq++));
  var c = { id: id, msg: msg, tree: clone(tree), parents: parents.slice(), time: Date.now() };
  s.commits.push(c);
  return c;
}
function resolveRef(s, ref) {
  if (!ref) return null;
  var steps = 0, base = ref;
  var m = ref.match(/^(.*?)((~\d*)|(\^+))$/);
  if (m) {
    base = m[1];
    steps = m[3] !== undefined ? (m[3] === '~' ? 1 : parseInt(m[3].slice(1), 10)) : m[4].length;
  }
  var id = null;
  if (base === 'HEAD' || base === '') id = headId(s);
  else if (s.branches[base] !== undefined) id = s.branches[base];
  else if (s.remoteBranches[base] !== undefined) id = s.remoteBranches[base];
  else {
    for (var i = 0; i < s.commits.length; i++) {
      if (s.commits[i].id.indexOf(base) === 0) { id = s.commits[i].id; break; }
    }
  }
  if (!id) return null;
  for (var k = 0; k < steps; k++) {
    var c = commitById(s, id);
    if (!c || !c.parents.length) return null;
    id = c.parents[0];
  }
  return id;
}

global.GIT_CORE1 = {
  fnv: fnv, clone: clone, diffLines: diffLines, hunks: hunks, merge3: merge3,
  freshState: freshState, headId: headId, commitById: commitById,
  isAncestor: isAncestor, mergeBase: mergeBase, treeAt: treeAt,
  makeCommit: makeCommit, resolveRef: resolveRef
};
})(typeof window !== 'undefined' ? window : globalThis);
/* معمل Git التفاعلي — simulator core part 2: commands */
(function (global) {
'use strict';
var C = global.GIT_CORE1;

function fmtDate(t) {
  var d = new Date(t);
  var days = ['Sun','Mon','Tue','Wed','Thu','Fri','Sat'];
  var mons = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
  function p(x) { return (x < 10 ? '0' : '') + x; }
  return days[d.getDay()] + ' ' + mons[d.getMonth()] + ' ' + d.getDate() + ' ' +
    p(d.getHours()) + ':' + p(d.getMinutes()) + ':' + p(d.getSeconds()) + ' ' + d.getFullYear() + ' +0200';
}
function fullId(s, short) {
  var out = short;
  while (out.length < 40) out += C.fnv(out);
  return out.slice(0, 40);
}
function short(id) { return id.slice(0, 7); }

function headTree(s) {
  var h = C.headId(s);
  return h ? C.treeAt(s, h) : {};
}
function workingClean(s) {
  var ht = headTree(s);
  var keys = {};
  Object.keys(s.files).forEach(function (k) { keys[k] = 1; });
  Object.keys(ht).forEach(function (k) { keys[k] = 1; });
  return Object.keys(keys).every(function (k) { return s.files[k] === ht[k]; });
}

/* stat block like " 1 file changed, 2 insertions(+), 1 deletion(-)" */
function changeStat(s, oldTree, newTree) {
  var paths = {};
  Object.keys(oldTree || {}).forEach(function (p) { paths[p] = 1; });
  Object.keys(newTree || {}).forEach(function (p) { paths[p] = 1; });
  var files = 0, ins = 0, del = 0;
  Object.keys(paths).forEach(function (p) {
    var a = (oldTree || {})[p], b = (newTree || {})[p];
    if (a === b) return;
    files++;
    if (a !== undefined && b !== undefined) {
      C.diffLines(a.split('\n'), b.split('\n')).forEach(function (op) {
        if (op.t === '+') ins++; else if (op.t === '-') del++;
      });
    } else if (b !== undefined) ins += b.split('\n').length;
    else del += a.split('\n').length;
  });
  if (!files) return null;
  var str = ' ' + files + ' file' + (files > 1 ? 's' : '') + ' changed';
  if (ins || !del) str += ', ' + ins + ' insertion' + (ins === 1 ? '' : 's') + '(+)';
  if (del) str += ', ' + del + ' deletion' + (del === 1 ? '' : 's') + '(-)';
  return str;
}

/* ---------- output helpers ---------- */
function L(text, cls) { return { text: text, cls: cls || '' }; }
function err(text) { return L(text, 't-err'); }
function dim(text) { return L(text, 't-dim'); }

/* ---------- per-command handlers: h(s, args, tok) -> lines[] ---------- */
var H = {};

H.init = function (s) {
  if (s.initialized) return [L('Reinitialized existing Git repository in ~/' + s.dirName + '/.git/')];
  s.initialized = true;
  s.HEAD = { branch: 'main' };
  s.branches = {};
  return [L('Initialized empty Git repository in ~/' + s.dirName + '/.git/', 't-ok'),
    dim('hint: البرانش الافتراضي اسمه main. اكتب help لو عايز تشوف الأوامر.')];
};

H.config = function (s, args) {
  var glob = args[0] === '--global';
  var rest = glob ? args.slice(1) : args;
  if (rest[0] === '--list') {
    var out = [];
    Object.keys(s.config).forEach(function (k) { if (s.config[k]) out.push(L(k + '=' + s.config[k])); });
    return out.length ? out : [dim('(مفيش إعدادات متظبطة لسه)')];
  }
  if (rest.length >= 2) {
    s.config[rest[0]] = rest.slice(1).join(' ');
    return [];
  }
  if (rest.length === 1) {
    var v = s.config[rest[0]];
    return v ? [L(v)] : [err('error: key does not contain a value: ' + rest[0])];
  }
  return [err('usage: git config --global user.name "اسمك"')];
};

function requireRepo(s) {
  return s.initialized ? null : [err('fatal: not a git repository (or any of the parent directories): .git'),
    dim('hint: ابدأ بـ git init الأول')];
}

H.status = function (s) {
  var r = requireRepo(s); if (r) return r;
  var out = [];
  var h = C.headId(s);
  if (s.HEAD.branch) out.push(L('On branch ' + s.HEAD.branch));
  else out.push(L('HEAD detached at ' + short(h)));
  var up = s.HEAD.branch && s.upstream[s.HEAD.branch];
  if (up && s.remoteBranches[up]) {
    var remoteId = s.remoteBranches[up];
    if (remoteId === h) out.push(L("Your branch is up to date with '" + up + "'."));
    else if (C.isAncestor(s, remoteId, h)) out.push(L("Your branch is ahead of '" + up + "' by 1+ commit(s)."));
    else out.push(L("Your branch and '" + up + "' have diverged."));
    out.push(L(''));
  }
  if (s.merging) {
    out.push(L('You have unmerged paths.'));
    out.push(dim('  (fix conflicts and run "git commit")'));
    out.push(dim('  (use "git merge --abort" to abort the merge)'));
    out.push(L(''));
  }
  if (!h && !s.merging) out.push(L(''), L('No commits yet'), L(''));

  var ht = headTree(s);
  var staged = [], unstaged = [], untracked = [], unmerged = [];
  var paths = {};
  [s.files, s.index, ht].forEach(function (m) { Object.keys(m).forEach(function (p) { paths[p] = 1; }); });
  Object.keys(paths).sort().forEach(function (p) {
    if (s.merging && s.merging.conflicts.indexOf(p) !== -1) { unmerged.push(p); return; }
    var w = s.files[p], idx = s.index[p], c = ht[p];
    var idxVal = idx && idx.deleted ? undefined : idx;
    /* staged vs HEAD */
    if (idx !== undefined || c !== undefined) {
      if (idx && idx.deleted && c !== undefined) staged.push(['deleted', p]);
      else if (idxVal !== undefined && c === undefined) staged.push(['new file', p]);
      else if (idxVal !== undefined && c !== undefined && idxVal !== c) staged.push(['modified', p]);
    }
    /* unstaged vs index */
    var base = idx !== undefined ? idxVal : c;
    if (w === undefined && base !== undefined) unstaged.push(['deleted', p]);
    else if (w !== undefined && base !== undefined && w !== base) unstaged.push(['modified', p]);
    if (w !== undefined && c === undefined && idx === undefined) untracked.push(p);
  });

  if (staged.length) {
    out.push(L('Changes to be committed:'));
    out.push(dim('  (use "git restore --staged <file>..." to unstage)'));
    staged.forEach(function (x) { out.push({ text: '\t' + x[0] + ':   ' + x[1], cls: 't-ok' }); });
    out.push(L(''));
  }
  if (unmerged.length) {
    out.push(L('Unmerged paths:'));
    out.push(dim('  (use "git add <file>..." to mark resolution)'));
    unmerged.forEach(function (p) { out.push({ text: '\tboth modified:   ' + p, cls: 't-err' }); });
    out.push(L(''));
  }
  if (unstaged.length) {
    out.push(L('Changes not staged for commit:'));
    out.push(dim('  (use "git add <file>..." to update what will be committed)'));
    unstaged.forEach(function (x) { out.push({ text: '\t' + x[0] + ':   ' + x[1], cls: 't-del' }); });
    out.push(L(''));
  }
  if (untracked.length) {
    out.push(L('Untracked files:'));
    out.push(dim('  (use "git add <file>..." to include in what will be committed)'));
    untracked.forEach(function (p) { out.push({ text: '\t' + p, cls: 't-del' }); });
    out.push(L(''));
  }
  if (!staged.length && !unstaged.length && !untracked.length && !unmerged.length) {
    out.push(L('nothing to commit, working tree clean', 't-ok'));
  } else if (!staged.length && !unmerged.length) {
    if (untracked.length && !unstaged.length) out.push(L('nothing added to commit but untracked files present (use "git add" to track)'));
    else out.push(L('no changes added to commit (use "git add" and/or "git commit -a")'));
  }
  return out;
};

H.add = function (s, args) {
  var r = requireRepo(s); if (r) return r;
  var targets = args.filter(function (a) { return a !== '-A' && a !== '--all'; });
  var all = args.indexOf('.') !== -1 || args.indexOf('-A') !== -1 || args.indexOf('--all') !== -1;
  if (!targets.length && !all) return [err("Nothing specified, nothing added."), dim("hint: جرب git add . أو git add اسم-الملف")];
  var names = all ? Object.keys(s.files) : targets.filter(function (t) { return t !== '.'; });
  var added = [], missing = [];
  var htA = headTree(s);
  names.forEach(function (p) {
    if (s.files[p] !== undefined) {
      if (s.files[p] === htA[p]) delete s.index[p];
      else s.index[p] = s.files[p];
      added.push(p);
    }
    else if (s.index[p] !== undefined || htA[p] !== undefined) { s.index[p] = { deleted: true }; added.push(p); }
    else missing.push(p);
  });
  /* resolving conflicts: adding a conflicted path marks it resolved */
  if (s.merging) {
    s.merging.conflicts = s.merging.conflicts.filter(function (p) {
      return added.indexOf(p) === -1;
    });
  }
  if (missing.length) return missing.map(function (p) { return err("fatal: pathspec '" + p + "' did not match any files"); });
  return [];
};

H.commit = function (s, args) {
  var r = requireRepo(s); if (r) return r;
  var mi = args.indexOf('-m');
  if (mi === -1 || !args[mi + 1]) return [err('fatal: no commit message given. استخدم git commit -m "رسالتك"')];
  var msg = args.slice(mi + 1).join(' ');
  if (!s.config['user.name'] || !s.config['user.email']) {
    return [err('*** Please tell me who you are.'), L(''), dim('Run'), dim('  git config --global user.name "اسمك"'),
      dim('  git config --global user.email "انت@example.com"'), dim('عشان Git يعرف يمضي الـ commits باسمك.')];
  }
  if (s.merging && s.merging.conflicts.length) {
    return [err('error: Committing is not possible because you have unmerged files.'),
      dim('hint: افتح الملفات المتعارضة، صلحها، وبعدين git add عليها وارجع اعمل commit')];
  }
  var ht = headTree(s);
  var newTree = C.clone(ht);
  Object.keys(s.index).forEach(function (p) {
    if (s.index[p] && s.index[p].deleted) delete newTree[p];
    else newTree[p] = s.index[p];
  });
  var somethingStaged = Object.keys(s.index).length > 0;
  if (!somethingStaged && !s.merging) {
    if (workingClean(s)) return [L('nothing to commit, working tree clean')];
    return [L('no changes added to commit (use "git add" and/or "git commit -a")')];
  }
  if (JSON.stringify(newTree) === JSON.stringify(ht) && !s.merging) {
    return [L('nothing to commit, working tree clean')];
  }
  var parent = C.headId(s);
  var parents = parent ? [parent] : [];
  var branchName = s.HEAD.branch;
  if (s.merging) {
    parents.push(s.merging.theirs);
    s.merging = null;
  }
  var c = C.makeCommit(s, msg, newTree, parents);
  if (branchName) s.branches[branchName] = c.id;
  else s.HEAD.detached = c.id;
  s.index = {};
  var tag = (branchName || 'detached HEAD') + (parents.length === 0 ? ' (root-commit)' : '');
  var out = [L('[' + tag + ' ' + short(c.id) + '] ' + msg, 't-ok')];
  var stat = changeStat(s, ht, newTree);
  if (stat) out.push(L(stat));
  return out;
};


function graphLog(s, oneline, all) {
  var tips = [];
  var h = C.headId(s);
  if (h) tips.push(h);
  if (all) {
    Object.keys(s.branches).forEach(function (b) { tips.push(s.branches[b]); });
    Object.keys(s.remoteBranches).forEach(function (b) { tips.push(s.remoteBranches[b]); });
  }
  var seen = {}, list = [];
  tips.forEach(function (t) {
    var st = [t];
    while (st.length) {
      var id = st.pop();
      if (!id || seen[id]) continue;
      seen[id] = 1;
      var c = C.commitById(s, id);
      if (!c) continue;
      list.push(c);
      c.parents.forEach(function (p) { st.push(p); });
    }
  });
  list.sort(function (a, b) { return s.commits.indexOf(b) - s.commits.indexOf(a); });
  function refsLabel(id) {
    var refs = [];
    if (id === h) refs.push('HEAD' + (s.HEAD.branch ? ' -> ' + s.HEAD.branch : ''));
    Object.keys(s.branches).forEach(function (b) { if (s.branches[b] === id && !(id === h && b === s.HEAD.branch)) refs.push(b); });
    Object.keys(s.remoteBranches).forEach(function (b) { if (s.remoteBranches[b] === id) refs.push(b); });
    return refs.length ? ' (' + refs.join(', ') + ')' : '';
  }
  var lanes = [], out = [];
  function laneStr(symIdx, sym) {
    var parts = [];
    for (var i = 0; i < lanes.length; i++) parts.push(i === symIdx ? sym : '|');
    return parts.join(' ');
  }
  list.forEach(function (c) {
    var idx = lanes.indexOf(c.id);
    if (idx === -1) { lanes.push(c.id); idx = lanes.length - 1; }
    out.push({ text: laneStr(idx, '*') + ' ' + (oneline ? short(c.id) + refsLabel(c.id) + ' ' + c.msg : 'commit ' + fullId(s, c.id) + refsLabel(c.id)), cls: 't-id' });
    var added = 0, i, parts;
    if (!c.parents.length) { lanes.splice(idx, 1); }
    else {
      lanes[idx] = c.parents[0];
      for (var k = 1; k < c.parents.length; k++) {
        if (lanes.indexOf(c.parents[k]) === -1) { lanes.splice(idx + 1 + added, 0, c.parents[k]); added++; }
      }
    }
    if (added) {
      parts = [];
      for (i = 0; i < lanes.length; i++) parts.push(i > idx && i <= idx + added ? '\\' : '|');
      out.push(L(parts.slice(0, idx + 1 + added).join('')));
    }
    var dup = -1;
    for (i = 0; i < lanes.length; i++) { if (lanes.indexOf(lanes[i]) !== i) { dup = i; break; } }
    while (dup !== -1) {
      parts = [];
      for (i = 0; i <= dup; i++) parts.push(i < dup ? '|' : '/');
      out.push(L(parts.join('')));
      lanes.splice(dup, 1);
      dup = -1;
      for (i = 0; i < lanes.length; i++) { if (lanes.indexOf(lanes[i]) !== i) { dup = i; break; } }
    }
  });
  return out;
}

H.log = function (s, args) {
  var r = requireRepo(s); if (r) return r;
  var h = C.headId(s);
  if (!h) return [err("fatal: your current branch '" + (s.HEAD.branch || 'main') + "' does not have any commits yet")];
  var oneline = args.indexOf('--oneline') !== -1;
  if (args.indexOf('--graph') !== -1) return graphLog(s, oneline, args.indexOf('--all') !== -1);
  var out = [], id = h, guard = 0;
  while (id && guard++ < 50) {
    var c = C.commitById(s, id);
    if (oneline) {
      var label = '';
      if (id === h) {
        var refs = ['HEAD' + (s.HEAD.branch ? ' -> ' + s.HEAD.branch : '')];
        Object.keys(s.branches).forEach(function (b) { if (s.branches[b] === id && b !== s.HEAD.branch) refs.push(b); });
        Object.keys(s.remoteBranches).forEach(function (b) { if (s.remoteBranches[b] === id) refs.push(b); });
        label = ' (' + refs.join(', ') + ')';
      }
      out.push({ text: short(id) + label + ' ' + c.msg, cls: 't-id' });
      id = c.parents[0];
    } else {
      var refs2 = [];
      if (id === h) refs2.push('HEAD' + (s.HEAD.branch ? ' -> ' + s.HEAD.branch : ''));
      Object.keys(s.branches).forEach(function (b) { if (s.branches[b] === id && b !== s.HEAD.branch) refs2.push(b); });
      Object.keys(s.remoteBranches).forEach(function (b) { if (s.remoteBranches[b] === id) refs2.push(b); });
      out.push({ text: 'commit ' + fullId(s, id) + (refs2.length ? ' (' + refs2.join(', ') + ')' : ''), cls: 't-id' });
      if (c.parents.length > 1) out.push(L('Merge: ' + c.parents.map(short).join(' ')));
      out.push(L('Author: ' + s.config['user.name'] + ' <' + s.config['user.email'] + '>'));
      out.push(L('Date:   ' + fmtDate(c.time)));
      out.push(L(''));
      out.push(L('    ' + c.msg));
      out.push(L(''));
      id = c.parents[0];
    }
  }
  return out;
};

H.show = function (s, args) {
  var r = requireRepo(s); if (r) return r;
  var ref = args[0] || 'HEAD';
  var id = C.resolveRef(s, ref);
  if (!id) return [err("fatal: ambiguous argument '" + ref + "': unknown revision or path")];
  var c = C.commitById(s, id);
  var out = [
    { text: 'commit ' + fullId(s, id), cls: 't-id' },
    L('Author: ' + s.config['user.name'] + ' <' + s.config['user.email'] + '>'),
    L('Date:   ' + fmtDate(c.time)), L(''), L('    ' + c.msg), L('')
  ];
  var pt = c.parents.length ? C.treeAt(s, c.parents[0]) : {};
  return out.concat(diffTrees(pt, c.tree));
};

function diffTrees(oldTree, newTree) {
  var out = [];
  var paths = {};
  Object.keys(oldTree).forEach(function (p) { paths[p] = 1; });
  Object.keys(newTree).forEach(function (p) { paths[p] = 1; });
  Object.keys(paths).sort().forEach(function (p) {
    var a = oldTree[p], b = newTree[p];
    if (a === b) return;
    out.push({ text: 'diff --git a/' + p + ' b/' + p, cls: 't-dim' });
    if (a === undefined) out.push(L('new file mode 100644', 't-dim'));
    if (b === undefined) { out.push(L('deleted file mode 100644', 't-dim')); }
    out.push(L('--- ' + (a === undefined ? '/dev/null' : 'a/' + p), 't-dim'));
    out.push(L('+++ ' + (b === undefined ? '/dev/null' : 'b/' + p), 't-dim'));
    var ops = C.diffLines(a === undefined ? [] : a.split('\n'), b === undefined ? [] : b.split('\n'));
    out.push(L('@@', 't-id'));
    ops.forEach(function (op) {
      if (op.t === '+') out.push({ text: '+' + op.line, cls: 't-add' });
      else if (op.t === '-') out.push({ text: '-' + op.line, cls: 't-del' });
      else out.push(L(' ' + op.line));
    });
  });
  return out;
}

H.diff = function (s, args) {
  var r = requireRepo(s); if (r) return r;
  var staged = args.indexOf('--staged') !== -1 || args.indexOf('--cached') !== -1;
  var oldT, newT;
  if (staged) {
    oldT = headTree(s);
    newT = {};
    Object.keys(oldT).forEach(function (p) { newT[p] = oldT[p]; });
    Object.keys(s.index).forEach(function (p) {
      if (s.index[p] && s.index[p].deleted) delete newT[p]; else newT[p] = s.index[p];
    });
  } else {
    oldT = {};
    var ht = headTree(s);
    Object.keys(ht).forEach(function (p) { oldT[p] = s.index[p] !== undefined && !s.index[p].deleted ? s.index[p] : ht[p]; });
    newT = s.files;
  }
  var out = diffTrees(oldT, newT);
  return out.length ? out : [dim('(مفيش فروقات)')];
};

H.branch = function (s, args) {
  var r = requireRepo(s); if (r) return r;
  var del = args.indexOf('-d'), forceDel = args.indexOf('-D');
  var names = args.filter(function (a) { return a[0] !== '-'; });
  if (del !== -1 || forceDel !== -1) {
    var idx = Math.max(del, forceDel);
    var name = args[idx + 1];
    if (!s.branches[name]) return [err("error: branch '" + name + "' not found")];
    if (s.HEAD.branch === name) return [err("error: cannot delete branch '" + name + "' checked out at '~/" + s.dirName + "'")];
    if (forceDel === -1 && !C.isAncestor(s, s.branches[name], C.headId(s))) {
      return [err("error: the branch '" + name + "' is not fully merged"),
        dim("hint: لو متأكد إنك عايز تمسحه: git branch -D " + name)];
    }
    var wasId = s.branches[name];
    delete s.branches[name];
    return [L('Deleted branch ' + name + ' (was ' + short(wasId) + ').', 't-ok')];
  }
  if (!names.length) {
    var out = [];
    Object.keys(s.branches).sort().forEach(function (b) {
      out.push({ text: (b === s.HEAD.branch ? '* ' : '  ') + b, cls: b === s.HEAD.branch ? 't-ok' : '' });
    });
    if (!out.length) out.push(dim('(لسه مفيش branches — اعمل أول commit)') );
    return out;
  }
  var nn = names[0];
  if (s.branches[nn]) return [err("fatal: a branch named '" + nn + "' already exists")];
  var h = C.headId(s);
  if (!h) return [err('fatal: not a valid object name: \'' + (s.HEAD.branch || 'main') + '\' — اعمل أول commit')];
  s.branches[nn] = h;
  return [];
};

function doSwitch(s, name, create) {
  if (create) {
    if (s.branches[name]) return [err("fatal: a branch named '" + name + "' already exists")];
    var h = C.headId(s);
    if (!h) return [err('fatal: اعمل أول commit قبل ما تعمل branch')];
    s.branches[name] = h;
    s.HEAD = { branch: name };
    return [L("Switched to a new branch '" + name + "'", 't-ok')];
  }
  if (!s.branches[name]) return [err("error: pathspec '" + name + "' did not match any file(s) known to git")];
  if (s.HEAD.branch === name) return [L("Already on '" + name + "'")];
  if (s.merging) return [err('error: لازم تخلص الـ merge الحالي الأول (git commit أو git merge --abort)')];
  var curTree = headTree(s);
  var newTree = C.treeAt(s, s.branches[name]);
  var carry = {};
  Object.keys(s.files).forEach(function (f) {
    if (curTree[f] === undefined && newTree[f] === undefined) carry[f] = s.files[f];
  });
  s.files = C.clone(newTree);
  Object.keys(carry).forEach(function (f) { s.files[f] = carry[f]; });
  s.index = {};
  s.HEAD = { branch: name };
  return [L("Switched to branch '" + name + "'", 't-ok')];
}
H.switch = function (s, args) {
  var r = requireRepo(s); if (r) return r;
  var ci = args.indexOf('-c');
  if (ci !== -1) return doSwitch(s, args[ci + 1], true);
  return doSwitch(s, args.filter(function (a) { return a[0] !== '-'; })[0], false);
};
H.checkout = function (s, args) {
  var r = requireRepo(s); if (r) return r;
  var bi = args.indexOf('-b');
  if (bi !== -1) return doSwitch(s, args[bi + 1], true);
  var ddi = args.indexOf('--');
  if (ddi !== -1) {
    var f = args[ddi + 1];
    if (s.index[f] !== undefined && !s.index[f].deleted) { s.files[f] = s.index[f]; return []; }
    var ht = headTree(s);
    if (ht[f] !== undefined) { s.files[f] = ht[f]; return []; }
    return [err("error: pathspec '" + f + "' did not match any file(s) known to git")];
  }
  var name = args.filter(function (a) { return a[0] !== '-'; })[0];
  if (s.branches[name]) return doSwitch(s, name, false);
  var id = C.resolveRef(s, name);
  if (id) {
    s.HEAD = { detached: id };
    var ht2 = C.treeAt(s, id);
    s.files = C.clone(ht2); s.index = {};
    return [dim('Note: switching to \'' + name + '\'.'), dim(''), dim('You are in \'detached HEAD\' state.')];
  }
  return [err("error: pathspec '" + name + "' did not match any file(s) known to git")];
};

function mergeInto(s, otherId, label, otherName) {
  var h = C.headId(s);
  var out = [];
  if (s.merging) return [err('fatal: You have not concluded your merge (MERGE_HEAD exists).'),
    dim('hint: خلص الـ merge الحالي (commit) أو كانسلها بـ git merge --abort')];
  if (h === otherId || C.isAncestor(s, otherId, h)) return [L('Already up to date.')];
  if (!h || C.isAncestor(s, h, otherId)) {
    /* fast-forward */
    out.push(L('Updating ' + (h ? short(h) : '(empty)') + '..' + short(otherId)));
    out.push(L('Fast-forward', 't-ok'));
    var nt = C.treeAt(s, otherId);
    var stat = changeStat(s, headTree(s), nt);
    if (stat) out.push(L(stat));
    s.files = C.clone(nt); s.index = {};
    if (s.HEAD.branch) s.branches[s.HEAD.branch] = otherId; else s.HEAD.detached = otherId;
    return out;
  }
  var base = C.mergeBase(s, h, otherId);
  var m = C.merge3(C.treeAt(s, base || ''), headTree(s), C.treeAt(s, otherId), otherName || 'theirs');
  if (m.clean) {
    var newTree = {};
    Object.keys(m.files).forEach(function (p) { newTree[p] = m.files[p].content; });
    var oldTree = headTree(s);
    var c = C.makeCommit(s, 'Merge branch \'' + (otherName || label) + '\'', newTree, [h, otherId]);
    if (s.HEAD.branch) s.branches[s.HEAD.branch] = c.id; else s.HEAD.detached = c.id;
    s.files = C.clone(newTree); s.index = {};
    out.push(L("Merge made by the 'ort' strategy.", 't-ok'));
    var stat2 = changeStat(s, oldTree, newTree);
    if (stat2) out.push(L(stat2));
    return out;
  }
  /* conflicts */
  Object.keys(m.files).forEach(function (p) { s.files[p] = m.files[p].content; });
  s.merging = { theirs: otherId, base: base, conflicts: m.conflicts.slice() };
  m.conflicts.forEach(function (p) {
    out.push(L('Auto-merging ' + p));
    out.push(err('CONFLICT (content): Merge conflict in ' + p));
  });
  out.push(err('Automatic merge failed; fix conflicts and then commit the result.'));
  return out;
}
H.merge = function (s, args) {
  var r = requireRepo(s); if (r) return r;
  if (args.indexOf('--abort') !== -1) {
    if (!s.merging) return [err('fatal: There is no merge to abort')];
    var ht = headTree(s);
    s.files = C.clone(ht); s.index = {}; s.merging = null;
    return [L('Merge aborted. رجعنا لحالة ما قبل الـ merge.', 't-ok')];
  }
  var name = args.filter(function (a) { return a[0] !== '-'; })[0];
  if (!name) return [err('fatal: No branch specified — جرب git merge اسم-البرانش')];
  var otherId = C.resolveRef(s, name);
  if (!otherId) return [err("merge: " + name + ' - not something we can merge')];
  return mergeInto(s, otherId, name, name);
};

H.reset = function (s, args) {
  var r = requireRepo(s); if (r) return r;
  var mode = 'mixed';
  if (args.indexOf('--soft') !== -1) mode = 'soft';
  if (args.indexOf('--hard') !== -1) mode = 'hard';
  var ref = args.filter(function (a) { return a[0] !== '-'; })[0] || 'HEAD';
  var id = C.resolveRef(s, ref);
  if (!id) return [err("fatal: ambiguous argument '" + ref + "': unknown revision or path")];
  var c = C.commitById(s, id);
  if (s.HEAD.branch) s.branches[s.HEAD.branch] = id; else s.HEAD.detached = id;
  s.merging = null;
  if (mode !== 'soft') s.index = {};
  if (mode === 'hard') { s.files = C.clone(c.tree); return [L('HEAD is now at ' + short(id) + ' ' + c.msg, 't-ok')]; }
  if (mode === 'mixed') {
    var out = [];
    var ht = c.tree;
    Object.keys(s.files).forEach(function (p) {
      if (s.files[p] !== ht[p]) out.push(L('M\t' + p));
    });
    if (out.length) out.unshift(L('Unstaged changes after reset:'));
    return out;
  }
  return [];
};

H.restore = function (s, args) {
  var r = requireRepo(s); if (r) return r;
  var staged = args.indexOf('--staged') !== -1;
  var f = args.filter(function (a) { return a[0] !== '-'; })[0];
  if (!f) return [err('fatal: you must specify path(s) to restore')];
  if (staged) {
    var ht = headTree(s);
    delete s.index[f];
    return [];
  }
  if (s.index[f] !== undefined && !s.index[f].deleted) { s.files[f] = s.index[f]; return []; }
  var ht2 = headTree(s);
  if (ht2[f] !== undefined) { s.files[f] = ht2[f]; return []; }
  return [err("error: pathspec '" + f + "' did not match any file(s) known to git")];
};

H.revert = function (s, args) {
  var r = requireRepo(s); if (r) return r;
  var ref = args.filter(function (a) { return a[0] !== '-'; })[0] || 'HEAD';
  var id = C.resolveRef(s, ref);
  if (!id) return [err("fatal: bad revision '" + ref + "'")];
  var c = C.commitById(s, id);
  if (c.parents.length !== 1) return [err('المحاكي بيدعم revert للـ commits العادية بس (مش الـ merge commits)')];
  var pt = C.treeAt(s, c.parents[0]);
  var cur = headTree(s);
  var newTree = C.clone(cur);
  var paths = {};
  Object.keys(c.tree).forEach(function (p) { paths[p] = 1; });
  Object.keys(pt).forEach(function (p) { paths[p] = 1; });
  Object.keys(paths).forEach(function (p) {
    if (cur[p] === c.tree[p]) {
      if (pt[p] === undefined) delete newTree[p]; else newTree[p] = pt[p];
    }
  });
  var h = C.headId(s);
  var nc = C.makeCommit(s, 'Revert "' + c.msg + '"', newTree, h ? [h] : []);
  if (s.HEAD.branch) s.branches[s.HEAD.branch] = nc.id; else s.HEAD.detached = nc.id;
  s.files = C.clone(newTree); s.index = {};
  return [L('[' + (s.HEAD.branch || 'HEAD') + ' ' + short(nc.id) + '] Revert "' + c.msg + '"', 't-ok')];
};

H.remote = function (s, args) {
  var r = requireRepo(s); if (r) return r;
  if (args[0] === 'add') {
    if (!args[1] || !args[2]) return [err('usage: git remote add origin https://github.com/USER/REPO.git')];
    s.remotes[args[1]] = args[2];
    if (!s.remoteRepo) s.remoteRepo = { url: args[2], branches: {} };
    return [];
  }
  if (args[0] === 'remove' || args[0] === 'rm') {
    delete s.remotes[args[1]];
    Object.keys(s.remoteBranches).forEach(function (k) { if (k.indexOf(args[1] + '/') === 0) delete s.remoteBranches[k]; });
    return [];
  }
  if (args.indexOf('-v') !== -1) {
    var out = [];
    Object.keys(s.remotes).forEach(function (n) {
      out.push(L(n + '\t' + s.remotes[n] + ' (fetch)'));
      out.push(L(n + '\t' + s.remotes[n] + ' (push)'));
    });
    return out;
  }
  return Object.keys(s.remotes).map(function (n) { return L(n); });
};

function pushBranch(s, remoteName, bname, setUp) {
  var out = [];
  if (!s.remotes[remoteName]) return [err("fatal: '" + remoteName + "' does not appear to be a git repository"),
    dim('hint: اعمل git remote add origin <url> الأول')];
  if (!s.branches[bname]) return [err("error: src refspec " + bname + " does not match any")];
  var local = s.branches[bname];
  var rk = remoteName + '/' + bname;
  var remoteHead = s.remoteRepo.branches[bname] || null;
  if (remoteHead === local) { s.remoteBranches[rk] = local; return [L('Everything up-to-date')]; }
  if (remoteHead && !C.isAncestor(s, remoteHead, local)) {
    return [err(' ! [rejected]        ' + bname + ' -> ' + bname + ' (non-fast-forward)'),
      err('error: failed to push some refs to \'' + s.remotes[remoteName] + '\''),
      dim('hint: في commits على GitHub مش عندك. اعمل git pull الأول وبعدين push تاني')];
  }
  s.remoteRepo.branches[bname] = local;
  s.remoteBranches[rk] = local;
  out.push(L('To ' + s.remotes[remoteName]));
  if (!remoteHead) out.push(L(' * [new branch]      ' + bname + ' -> ' + bname, 't-ok'));
  else out.push(L('   ' + short(remoteHead) + '..' + short(local) + '  ' + bname + ' -> ' + bname, 't-ok'));
  if (setUp) {
    s.upstream[bname] = rk;
    out.push(L("branch '" + bname + "' set up to track '" + rk + "'."));
  }
  return out;
}
H.push = function (s, args) {
  var r = requireRepo(s); if (r) return r;
  var setUp = args.indexOf('-u') !== -1 || args.indexOf('--set-upstream') !== -1;
  var pos = args.filter(function (a) { return a[0] !== '-'; });
  var remoteName = pos[0], bname = pos[1];
  if (!remoteName) {
    var up = s.HEAD.branch && s.upstream[s.HEAD.branch];
    if (up) { remoteName = up.split('/')[0]; bname = s.HEAD.branch; }
    else if (s.remotes.origin) remoteName = 'origin';
  }
  if (!remoteName) return [err('fatal: No configured push destination.'),
    dim('hint: git remote add origin https://github.com/USER/REPO.git')];
  if (!bname) {
    if (!s.HEAD.branch) return [err('fatal: You are not currently on a branch.')];
    bname = s.HEAD.branch;
    var up2 = s.upstream[bname];
    if (!up2 && !setUp) {
      return [err('fatal: The current branch ' + bname + ' has no upstream branch.'),
        dim('To push the current branch and set the remote as upstream, use'), L(''),
        dim('    git push --set-upstream ' + remoteName + ' ' + bname)];
    }
  }
  return pushBranch(s, remoteName, bname, setUp);
};

H.fetch = function (s, args) {
  var r = requireRepo(s); if (r) return r;
  var remoteName = args[0] || 'origin';
  if (!s.remotes[remoteName] || !s.remoteRepo) return [err("fatal: '" + remoteName + "' does not appear to be a git repository")];
  var out = [];
  Object.keys(s.remoteRepo.branches).forEach(function (b) {
    var rk = remoteName + '/' + b;
    if (s.remoteBranches[rk] !== s.remoteRepo.branches[b]) {
      var old = s.remoteBranches[rk];
      s.remoteBranches[rk] = s.remoteRepo.branches[b];
      if (!old) out.push(L(' * [new branch]      ' + b + '        -> ' + rk, 't-ok'));
      else out.push(L('   ' + short(old) + '..' + short(s.remoteRepo.branches[b]) + '  ' + b + ' -> ' + rk, 't-ok'));
    }
  });
  if (out.length) out.unshift(L('From ' + s.remotes[remoteName]));
  return out;
};

H.pull = function (s, args) {
  var r = requireRepo(s); if (r) return r;
  var remoteName = 'origin', bname = s.HEAD.branch;
  var up = bname && s.upstream[bname];
  if (up) remoteName = up.split('/')[0];
  var pos = args.filter(function (a) { return a[0] !== '-'; });
  if (pos[0]) remoteName = pos[0];
  if (pos[1]) bname = pos[1];
  var out = H.fetch(s, [remoteName]);
  var rk = remoteName + '/' + bname;
  var remoteHead = s.remoteBranches[rk];
  if (!remoteHead) { if (!out.length) return [L('Already up to date.')]; return out; }
  if (remoteHead === C.headId(s)) { out.push(L('Already up to date.')); return out; }
  return out.concat(mergeInto(s, remoteHead, rk, rk));
};

H.clone = function (s, args) {
  var url = args[0];
  if (!url) return [err('usage: git clone https://github.com/USER/REPO.git')];
  var m = url.match(/([^\/:]+?)(\.git)?$/);
  var dir = m ? m[1] : 'project';
  var fresh = C.freshState();
  fresh.initialized = true;
  fresh.dirName = dir;
  fresh.config = s.config;
  /* sample remote project */
  var readme = '# ' + dir + '\n\nمشروع تجريبي اتعمله clone من GitHub.\n';
  var idx = '<!DOCTYPE html>\n<html>\n<head><title>' + dir + '</title></head>\n<body>\n  <h1>أهلاً من ' + dir + '</h1>\n</body>\n</html>';
  var c1tree = { 'README.md': readme, 'index.html': idx };
  var c1 = C.makeCommit(fresh, 'Initial commit: project skeleton', c1tree, []);
  var css = 'body { font-family: sans-serif; background: #0f1420; color: #eee; }';
  var c2tree = C.clone(c1tree); c2tree['style.css'] = css;
  c2tree['index.html'] = idx.replace('</h1>', '</h1>\n  <p>أول تعديل على المشروع</p>');
  var c2 = C.makeCommit(fresh, 'Add styles and welcome paragraph', c2tree, [c1.id]);
  fresh.commits = [c1, c2];
  fresh.branches = { main: c2.id };
  fresh.HEAD = { branch: 'main' };
  fresh.files = C.clone(c2tree);
  fresh.remotes = { origin: url };
  fresh.upstream = { main: 'origin/main' };
  fresh.remoteBranches = { 'origin/main': c2.id };
  fresh.remoteRepo = { url: url, branches: { main: c2.id } };
  Object.keys(s).forEach(function (k) { delete s[k]; });
  Object.keys(fresh).forEach(function (k) { s[k] = fresh[k]; });
  return [L("Cloning into '" + dir + "'..."),
    dim('remote: Enumerating objects: 8, done.'),
    dim('remote: Counting objects: 100% (8/8), done.'),
    dim('remote: Compressing objects: 100% (5/5), done.'),
    L('Receiving objects: 100% (8/8), done.', 't-ok')];
};

H.rm = function (s, args) {
  var r = requireRepo(s); if (r) return r;
  var cached = args.indexOf('--cached') !== -1;
  var f = args.filter(function (a) { return a[0] !== '-'; })[0];
  if (!f) return [err('usage: git rm [--cached] <file>')];
  if (headTree(s)[f] === undefined && s.index[f] === undefined) return [err("fatal: pathspec '" + f + "' did not match any files")];
  s.index[f] = { deleted: true };
  if (!cached) delete s.files[f];
  return [L("rm '" + f + "'")];
};

global.GIT_HANDLERS = H;
global.GIT_CMD_UTIL = { fmtDate: fmtDate, fullId: fullId, short: short, headTree: headTree, changeStat: changeStat, mergeInto: mergeInto, pushBranch: pushBranch };
})(typeof window !== 'undefined' ? window : globalThis);
