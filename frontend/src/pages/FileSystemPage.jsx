import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MainLayout } from '../components/common/Sidebar';
import GlassCard from '../components/common/GlassCard';
import AIChatPanel from '../components/ai/AIChatPanel';
import { HiFolderOpen, HiFolder, HiDocument, HiChevronRight, HiChevronDown, HiPlus, HiTrash } from 'react-icons/hi2';
import toast from 'react-hot-toast';

const initFS = {
  name: '/', type: 'dir', permissions: 'rwxr-xr-x', children: [
    { name: 'home', type: 'dir', permissions: 'rwxr-xr-x', children: [
      { name: 'user', type: 'dir', permissions: 'rwxr-xr-x', children: [
        { name: 'documents', type: 'dir', permissions: 'rwxr-xr-x', children: [
          { name: 'report.txt', type: 'file', permissions: 'rw-r--r--', size: '2.4KB' },
          { name: 'notes.md', type: 'file', permissions: 'rw-r--r--', size: '1.1KB' },
        ]},
        { name: 'downloads', type: 'dir', permissions: 'rwxr-xr-x', children: [] },
        { name: '.bashrc', type: 'file', permissions: 'rw-r--r--', size: '0.5KB' },
      ]},
    ]},
    { name: 'etc', type: 'dir', permissions: 'rwxr-xr-x', children: [
      { name: 'hosts', type: 'file', permissions: 'rw-r--r--', size: '0.2KB' },
      { name: 'passwd', type: 'file', permissions: 'rw-r-----', size: '1.8KB' },
    ]},
    { name: 'var', type: 'dir', permissions: 'rwxr-xr-x', children: [
      { name: 'log', type: 'dir', permissions: 'rwxr-xr-x', children: [
        { name: 'syslog', type: 'file', permissions: 'rw-r-----', size: '15KB' },
      ]},
    ]},
  ]
};

function TreeNode({ node, path, expanded, toggle, selected, select, onDelete }) {
  const isExpanded = expanded[path];
  const isSelected = selected === path;
  const isDir = node.type === 'dir';
  return (
    <div>
      <div onClick={() => { select(path); if (isDir) toggle(path); }}
        className={`flex items-center gap-2 px-3 py-1.5 rounded-lg cursor-pointer text-sm transition-all ${isSelected ? 'bg-neon-cyan/10 text-neon-cyan' : 'text-white/60 hover:bg-white/5 hover:text-white'}`}>
        {isDir ? (isExpanded ? <HiChevronDown className="w-4 h-4 flex-shrink-0" /> : <HiChevronRight className="w-4 h-4 flex-shrink-0" />) : <span className="w-4" />}
        {isDir ? (isExpanded ? <HiFolderOpen className="w-4 h-4 text-neon-cyan flex-shrink-0" /> : <HiFolder className="w-4 h-4 text-neon-purple flex-shrink-0" />) : <HiDocument className="w-4 h-4 text-white/40 flex-shrink-0" />}
        <span className="truncate">{node.name}</span>
        <span className="ml-auto text-[10px] text-white/20 font-mono">{node.permissions}</span>
      </div>
      <AnimatePresence>
        {isDir && isExpanded && node.children && (
          <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }} className="ml-4 overflow-hidden">
            {node.children.map((child, i) => (
              <TreeNode key={child.name + i} node={child} path={`${path}/${child.name}`} expanded={expanded} toggle={toggle} selected={selected} select={select} onDelete={onDelete} />
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default function FileSystemPage() {
  const [fs, setFs] = useState(initFS);
  const [expanded, setExpanded] = useState({ '/': true, '/home': true, '/home/user': true });
  const [selected, setSelected] = useState('/');
  const [termHistory, setTermHistory] = useState([{ type: 'output', text: 'OSNova File System v1.0 — Type "help" for commands' }]);
  const [termInput, setTermInput] = useState('');
  const [cwd, setCwd] = useState('/');
  const termRef = useRef(null);

  useEffect(() => { if (termRef.current) termRef.current.scrollTop = termRef.current.scrollHeight; }, [termHistory]);

  const toggle = (path) => setExpanded(prev => ({ ...prev, [path]: !prev[path] }));

  const findNode = (root, pathStr) => {
    if (pathStr === '/') return root;
    const parts = pathStr.split('/').filter(Boolean);
    let node = root;
    for (const part of parts) {
      if (!node.children) return null;
      node = node.children.find(c => c.name === part);
      if (!node) return null;
    }
    return node;
  };

  const addItem = (type) => {
    const name = prompt(`Enter ${type} name:`);
    if (!name) return;
    const newFs = JSON.parse(JSON.stringify(fs));
    const parent = findNode(newFs, selected);
    if (!parent || parent.type !== 'dir') { toast.error('Select a directory first'); return; }
    if (parent.children.some(c => c.name === name)) { toast.error('Already exists'); return; }
    parent.children.push(type === 'dir'
      ? { name, type: 'dir', permissions: 'rwxr-xr-x', children: [] }
      : { name, type: 'file', permissions: 'rw-r--r--', size: '0KB' });
    setFs(newFs);
    toast.success(`Created ${type}: ${name}`);
  };

  const deleteItem = () => {
    if (selected === '/') { toast.error("Can't delete root"); return; }
    const parts = selected.split('/').filter(Boolean);
    const itemName = parts.pop();
    const parentPath = '/' + parts.join('/');
    const newFs = JSON.parse(JSON.stringify(fs));
    const parent = findNode(newFs, parentPath || '/');
    if (parent?.children) {
      parent.children = parent.children.filter(c => c.name !== itemName);
      setFs(newFs);
      setSelected(parentPath || '/');
      toast.success(`Deleted: ${itemName}`);
    }
  };

  const execCommand = (cmd) => {
    const parts = cmd.trim().split(/\s+/);
    const command = parts[0];
    const args = parts.slice(1);
    const output = [];

    const resolve = (p) => {
      if (p.startsWith('/')) return p;
      if (cwd === '/') return '/' + p;
      return cwd + '/' + p;
    };

    switch (command) {
      case 'help':
        output.push('Available commands: ls, cd, mkdir, touch, rm, pwd, chmod, clear');
        break;
      case 'pwd':
        output.push(cwd);
        break;
      case 'ls': {
        const target = findNode(fs, args[0] ? resolve(args[0]) : cwd);
        if (!target) { output.push(`ls: cannot access: No such file or directory`); break; }
        if (target.type === 'file') { output.push(`${target.permissions} ${target.size || ''} ${target.name}`); break; }
        target.children.forEach(c => output.push(`${c.permissions}  ${c.type === 'dir' ? '📁' : '📄'} ${c.name}${c.size ? ` (${c.size})` : ''}`));
        if (target.children.length === 0) output.push('(empty directory)');
        break;
      }
      case 'cd': {
        if (!args[0] || args[0] === '/') { setCwd('/'); output.push('/'); break; }
        if (args[0] === '..') {
          const parts = cwd.split('/').filter(Boolean);
          parts.pop();
          setCwd('/' + parts.join('/') || '/');
          break;
        }
        const newPath = resolve(args[0]);
        const target = findNode(fs, newPath);
        if (!target || target.type !== 'dir') { output.push(`cd: ${args[0]}: Not a directory`); break; }
        setCwd(newPath);
        break;
      }
      case 'mkdir': {
        if (!args[0]) { output.push('mkdir: missing operand'); break; }
        const newFs = JSON.parse(JSON.stringify(fs));
        const parent = findNode(newFs, cwd);
        if (parent?.children.some(c => c.name === args[0])) { output.push(`mkdir: ${args[0]}: File exists`); break; }
        parent.children.push({ name: args[0], type: 'dir', permissions: 'rwxr-xr-x', children: [] });
        setFs(newFs);
        output.push(`Directory created: ${args[0]}`);
        break;
      }
      case 'touch': {
        if (!args[0]) { output.push('touch: missing operand'); break; }
        const newFs = JSON.parse(JSON.stringify(fs));
        const parent = findNode(newFs, cwd);
        if (!parent?.children.some(c => c.name === args[0])) {
          parent.children.push({ name: args[0], type: 'file', permissions: 'rw-r--r--', size: '0KB' });
          setFs(newFs);
        }
        output.push(`File created: ${args[0]}`);
        break;
      }
      case 'rm': {
        if (!args[0]) { output.push('rm: missing operand'); break; }
        const newFs = JSON.parse(JSON.stringify(fs));
        const parent = findNode(newFs, cwd);
        const idx = parent?.children.findIndex(c => c.name === args[0]);
        if (idx === -1 || idx === undefined) { output.push(`rm: ${args[0]}: No such file`); break; }
        parent.children.splice(idx, 1);
        setFs(newFs);
        output.push(`Removed: ${args[0]}`);
        break;
      }
      case 'chmod': {
        if (args.length < 2) { output.push('chmod: usage: chmod <permissions> <file>'); break; }
        const newFs = JSON.parse(JSON.stringify(fs));
        const target = findNode(newFs, resolve(args[1]));
        if (!target) { output.push(`chmod: ${args[1]}: No such file`); break; }
        target.permissions = args[0];
        setFs(newFs);
        output.push(`Changed permissions of ${args[1]} to ${args[0]}`);
        break;
      }
      case 'clear':
        setTermHistory([]);
        return;
      default:
        output.push(`${command}: command not found. Type "help" for available commands.`);
    }

    setTermHistory(prev => [
      ...prev,
      { type: 'input', text: `${cwd}$ ${cmd}` },
      ...output.map(t => ({ type: 'output', text: t })),
    ]);
  };

  const handleTermSubmit = (e) => {
    e.preventDefault();
    if (!termInput.trim()) return;
    execCommand(termInput);
    setTermInput('');
  };

  const selectedNode = findNode(fs, selected);

  return (
    <MainLayout>
      <AIChatPanel context="filesystem" />
      <div className="max-w-7xl mx-auto">
        <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
          <h1 className="text-3xl font-bold text-white mb-2">File System <span className="gradient-text">Explorer</span></h1>
          <p className="text-white/40">Navigate, create, and manage files with a Linux-style terminal</p>
        </motion.div>

        <div className="grid lg:grid-cols-3 gap-6">
          {/* Tree */}
          <div className="lg:col-span-1 space-y-4">
            <GlassCard hover={false}>
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-sm font-semibold text-neon-cyan uppercase tracking-wider">Directory Tree</h3>
                <div className="flex gap-2">
                  <button onClick={() => addItem('dir')} className="text-neon-cyan hover:text-white text-xs flex items-center gap-1"><HiPlus size={14} />Dir</button>
                  <button onClick={() => addItem('file')} className="text-neon-purple hover:text-white text-xs flex items-center gap-1"><HiPlus size={14} />File</button>
                  <button onClick={deleteItem} className="text-neon-pink hover:text-white"><HiTrash size={14} /></button>
                </div>
              </div>
              <div className="max-h-[400px] overflow-y-auto">
                <TreeNode node={fs} path="/" expanded={expanded} toggle={toggle} selected={selected} select={setSelected} onDelete={deleteItem} />
              </div>
            </GlassCard>

            {/* File Info */}
            {selectedNode && (
              <GlassCard hover={false}>
                <h3 className="text-sm font-semibold text-neon-cyan uppercase tracking-wider mb-3">Properties</h3>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between"><span className="text-white/40">Name</span><span className="text-white font-medium">{selectedNode.name}</span></div>
                  <div className="flex justify-between"><span className="text-white/40">Type</span><span className="text-neon-purple">{selectedNode.type}</span></div>
                  <div className="flex justify-between"><span className="text-white/40">Permissions</span><span className="text-neon-green font-mono">{selectedNode.permissions}</span></div>
                  {selectedNode.size && <div className="flex justify-between"><span className="text-white/40">Size</span><span className="text-white">{selectedNode.size}</span></div>}
                  {selectedNode.children && <div className="flex justify-between"><span className="text-white/40">Children</span><span className="text-white">{selectedNode.children.length}</span></div>}
                  <div className="flex justify-between"><span className="text-white/40">Path</span><span className="text-white/60 font-mono text-xs">{selected}</span></div>
                </div>
              </GlassCard>
            )}
          </div>

          {/* Terminal */}
          <div className="lg:col-span-2">
            <GlassCard hover={false} className="!p-0 overflow-hidden">
              <div className="flex items-center gap-2 px-4 py-3 border-b border-white/5 bg-white/3">
                <div className="w-3 h-3 rounded-full bg-red-500/80" />
                <div className="w-3 h-3 rounded-full bg-yellow-500/80" />
                <div className="w-3 h-3 rounded-full bg-green-500/80" />
                <span className="ml-2 text-xs text-white/30 font-mono">osnova-terminal</span>
              </div>
              <div ref={termRef} className="h-[500px] overflow-y-auto p-4 font-mono text-sm bg-osnova-bg/50">
                {termHistory.map((line, i) => (
                  <div key={i} className={`${line.type === 'input' ? 'text-neon-green' : 'text-white/60'} leading-relaxed`}>
                    {line.type === 'input' ? <><span className="text-neon-cyan">{line.text.split('$')[0]}$</span>{line.text.split('$').slice(1).join('$')}</> : line.text}
                  </div>
                ))}
                <form onSubmit={handleTermSubmit} className="flex items-center gap-1 mt-1">
                  <span className="text-neon-green">{cwd}</span><span className="text-neon-cyan">$</span>
                  <input value={termInput} onChange={e => setTermInput(e.target.value)}
                    className="flex-1 bg-transparent outline-none text-white caret-neon-cyan" autoFocus />
                </form>
              </div>
            </GlassCard>
          </div>
        </div>
      </div>
    </MainLayout>
  );
}
