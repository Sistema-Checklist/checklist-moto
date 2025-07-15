import React, { useState, useEffect } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/contexts/SupabaseAuthContext';
import { supabase } from '@/lib/customSupabaseClient';
import { format, parseISO, differenceInDays } from 'date-fns';

const SuperAdminPanel = () => {
  const { user, signUp } = useAuth();
  const [nome, setNome] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [users, setUsers] = useState([]);
  const [editUserId, setEditUserId] = useState(null);
  const [editNome, setEditNome] = useState('');
  const [editEmail, setEditEmail] = useState('');
  const [editPassword, setEditPassword] = useState('');
  const [editExpiry, setEditExpiry] = useState('');
  const [editFrozen, setEditFrozen] = useState(false);
  const [alertUsers, setAlertUsers] = useState([]);

  if (!user || user.email !== 'kauankg@hotmail.com') {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh]">
        <Card className="max-w-md w-full">
          <CardHeader>
            <CardTitle className="text-xl text-center">Acesso Negado</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-center text-red-600">Você não tem permissão para acessar este painel.</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Função para buscar usuários do Supabase (tabela customizada 'usuarios')
  const fetchUsers = async () => {
    const { data, error } = await supabase.from('usuarios').select('*').order('id', { ascending: true });
    if (!error) setUsers(data || []);
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  // Alerta de expiração
  useEffect(() => {
    const now = new Date();
    const alertList = users.filter(u => {
      if (!u.expiry_date) return false;
      const expiry = parseISO(u.expiry_date);
      const days = differenceInDays(expiry, now);
      return days === 1 && !u.frozen;
    });
    setAlertUsers(alertList);
  }, [users]);

  const handleRegister = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage('');
    // Cria usuário de autenticação
    const { error } = await signUp(email, password);
    if (error) {
      setMessage(error.message || 'Erro ao cadastrar usuário.');
      setLoading(false);
      return;
    }
    // Salva no banco customizado
    const { error: dbError } = await supabase.from('usuarios').insert({ nome, email, expiry_date: null, frozen: false });
    if (dbError) {
      setMessage(dbError.message || 'Usuário criado, mas erro ao salvar no banco.');
    } else {
      setMessage('Usuário cadastrado com sucesso!');
      setNome('');
      setEmail('');
      setPassword('');
      fetchUsers();
    }
    setLoading(false);
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Tem certeza que deseja deletar este usuário?')) return;
    await supabase.from('usuarios').delete().eq('id', id);
    fetchUsers();
  };

  const handleEdit = (user) => {
    setEditUserId(user.id);
    setEditNome(user.nome || '');
    setEditEmail(user.email);
    setEditPassword('');
    setEditExpiry(user.expiry_date ? format(parseISO(user.expiry_date), 'yyyy-MM-dd') : '');
    setEditFrozen(!!user.frozen);
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    setLoading(true);
    // Atualiza e-mail/nome/expiração/congelado na tabela customizada
    const updates = { nome: editNome, email: editEmail, expiry_date: editExpiry || null, frozen: editFrozen };
    await supabase.from('usuarios').update(updates).eq('id', editUserId);
    // Atualiza senha no auth se fornecida
    if (editPassword) {
      setMessage('Senha só pode ser alterada pelo próprio usuário via recuperação de senha.');
    }
    setEditUserId(null);
    setEditNome('');
    setEditEmail('');
    setEditPassword('');
    setEditExpiry('');
    setEditFrozen(false);
    fetchUsers();
    setLoading(false);
  };

  const handleFreeze = async (id, frozen) => {
    await supabase.from('usuarios').update({ frozen }).eq('id', id);
    fetchUsers();
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh]">
      <Card className="max-w-2xl w-full">
        <CardHeader>
          <CardTitle className="text-2xl text-center">Painel Super Admin</CardTitle>
        </CardHeader>
        <CardContent>
          {alertUsers.length > 0 && (
            <div className="mb-4 p-3 bg-yellow-100 border border-yellow-400 rounded text-yellow-800 text-center">
              Atenção: O(s) acesso(s) dos seguintes usuários irá expirar em 1 dia:<br />
              {alertUsers.map(u => <div key={u.id}>{u.email} ({u.nome})</div>)}
            </div>
          )}
          <form onSubmit={handleRegister} className="space-y-4 mb-8">
            <div>
              <label className="block text-sm font-medium mb-1">Nome (apelido) do novo usuário</label>
              <Input type="text" value={nome} onChange={e => setNome(e.target.value)} required placeholder="Nome ou apelido" />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">E-mail do novo usuário</label>
              <Input type="email" value={email} onChange={e => setEmail(e.target.value)} required placeholder="email@exemplo.com" />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Senha</label>
              <Input type="password" value={password} onChange={e => setPassword(e.target.value)} required placeholder="Senha" minLength={6} />
            </div>
            <Button type="submit" className="w-full bg-gradient-to-r from-purple-600 to-blue-600 text-white" disabled={loading}>
              {loading ? 'Cadastrando...' : 'Cadastrar Usuário'}
            </Button>
            {message && <p className={`text-center text-sm mt-2 ${message.includes('sucesso') ? 'text-green-600' : 'text-red-600'}`}>{message}</p>}
          </form>
          <h2 className="text-lg font-bold mb-2">Usuários Cadastrados</h2>
          <div className="overflow-x-auto">
            <table className="min-w-full border text-xs">
              <thead>
                <tr className="bg-gray-100">
                  <th className="p-2 border">Nome</th>
                  <th className="p-2 border">E-mail</th>
                  <th className="p-2 border">Expira em</th>
                  <th className="p-2 border">Status</th>
                  <th className="p-2 border">Ações</th>
                </tr>
              </thead>
              <tbody>
                {users.map(u => (
                  <tr key={u.id} className={u.frozen ? 'bg-red-100' : ''}>
                    <td className="p-2 border">{editUserId === u.id ? (
                      <Input value={editNome} onChange={e => setEditNome(e.target.value)} />
                    ) : u.nome}</td>
                    <td className="p-2 border">{editUserId === u.id ? (
                      <Input value={editEmail} onChange={e => setEditEmail(e.target.value)} />
                    ) : u.email}</td>
                    <td className="p-2 border">{editUserId === u.id ? (
                      <Input type="date" value={editExpiry} onChange={e => setEditExpiry(e.target.value)} />
                    ) : (u.expiry_date ? format(parseISO(u.expiry_date), 'dd/MM/yyyy') : 'Sem limite')}</td>
                    <td className="p-2 border">{editUserId === u.id ? (
                      <select value={editFrozen ? '1' : '0'} onChange={e => setEditFrozen(e.target.value === '1')} className="border rounded px-1 py-0.5">
                        <option value="0">Ativo</option>
                        <option value="1">Congelado</option>
                      </select>
                    ) : (u.frozen ? 'Congelado' : 'Ativo')}</td>
                    <td className="p-2 border space-x-1">
                      {editUserId === u.id ? (
                        <>
                          <Button size="sm" type="button" onClick={handleUpdate} className="bg-green-600 text-white">Salvar</Button>
                          <Button size="sm" type="button" onClick={() => setEditUserId(null)} className="bg-gray-300">Cancelar</Button>
                        </>
                      ) : (
                        <>
                          <Button size="sm" type="button" onClick={() => handleEdit(u)} className="bg-blue-600 text-white">Editar</Button>
                          <Button size="sm" type="button" onClick={() => handleDelete(u.id)} className="bg-red-600 text-white">Deletar</Button>
                          <Button size="sm" type="button" onClick={() => handleFreeze(u.id, !u.frozen)} className={u.frozen ? 'bg-green-500 text-white' : 'bg-yellow-500 text-white'}>
                            {u.frozen ? 'Descongelar' : 'Congelar'}
                          </Button>
                        </>
                      )}
                    </td>
                  </tr>
                ))}
                {users.length === 0 && (
                  <tr><td colSpan={5} className="text-center p-2">Nenhum usuário cadastrado.</td></tr>
                )}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default SuperAdminPanel; 