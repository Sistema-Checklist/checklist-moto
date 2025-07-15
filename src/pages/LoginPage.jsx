<<<<<<< HEAD
import React, { useState, useEffect } from 'react';
=======
import React, { useState } from 'react';
>>>>>>> e6341e13c18ec2e9698b8bfd0bf48aa94c6d8743
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from '@/components/ui/card';
import { useToast } from '@/components/ui/use-toast';
<<<<<<< HEAD
import { LogIn, Eye, EyeOff, UserPlus, Save } from 'lucide-react';
import { motion } from 'framer-motion';
import VistoriaHeader from '@/components/vistoria/VistoriaHeader';

const LoginPage = ({ onLoginSuccess }) => {
  const { toast } = useToast();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isRegistering, setIsRegistering] = useState(false);

  useEffect(() => {
    const storedUser = localStorage.getItem('locauto_user_credentials');
    if (!storedUser) {
      setIsRegistering(true);
    }
  }, []);

  const handleRegister = (e) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      toast({
        title: "Erro no Cadastro",
        description: "As senhas não coincidem.",
        variant: "destructive",
      });
      return;
    }
    if (password.length < 6) {
      toast({
        title: "Senha Fraca",
        description: "A senha deve ter pelo menos 6 caracteres.",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);
    setTimeout(() => {
      const credentials = { username, password };
      localStorage.setItem('locauto_user_credentials', JSON.stringify(credentials));
      toast({
        title: "Cadastro Realizado!",
        description: "Sua conta foi criada. Faça login para continuar.",
        className: "bg-green-500 text-white",
      });
      setIsRegistering(false);
      setUsername('');
      setPassword('');
      setConfirmPassword('');
      setIsLoading(false);
    }, 500);
  };

  const handleLogin = (e) => {
    e.preventDefault();
    setIsLoading(true);
    setTimeout(() => {
      const storedCredentialsString = localStorage.getItem('locauto_user_credentials');
      if (!storedCredentialsString) {
        toast({
          title: "Conta Não Encontrada",
          description: "Nenhuma conta cadastrada. Por favor, crie uma conta.",
          variant: "destructive",
        });
        setIsRegistering(true);
        setIsLoading(false);
        return;
      }
      
      const storedCredentials = JSON.parse(storedCredentialsString);
      if (username === storedCredentials.username && password === storedCredentials.password) {
        toast({
          title: "Login Bem-Sucedido!",
          description: "Bem-vindo de volta!",
          className: "bg-green-500 text-white",
        });
        onLoginSuccess();
      } else {
        toast({
          title: "Falha no Login",
          description: "Usuário ou senha incorretos. Tente novamente.",
          variant: "destructive",
        });
      }
      setIsLoading(false);
    }, 500);
  };

  const cardTitle = isRegistering ? "Criar Nova Conta" : "Acesso Restrito";
  const IconTitle = isRegistering ? UserPlus : LogIn;

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="flex flex-col items-center justify-start min-h-screen p-4 pt-8 md:pt-16"
    >
      <VistoriaHeader />
      <Card className="w-full max-w-md shadow-2xl mt-8">
        <CardHeader>
          <CardTitle className="text-3xl font-bold text-center text-gray-700 flex items-center justify-center">
            <IconTitle className="h-8 w-8 mr-3 text-purple-600" />
            {cardTitle}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={isRegistering ? handleRegister : handleLogin} className="space-y-6">
            <div>
              <Label htmlFor="username">Usuário</Label>
              <Input
                id="username"
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="Crie ou digite seu usuário"
                required
                className="mt-1"
                disabled={isLoading}
              />
            </div>
            <div className="relative">
              <Label htmlFor="password">Senha</Label>
              <Input
                id="password"
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder={isRegistering ? "Crie uma senha (mín. 6 caracteres)" : "Digite sua senha"}
                required
                className="mt-1 pr-10"
                disabled={isLoading}
              />
              <Button
                type="button"
                variant="ghost"
                size="icon"
                className="absolute right-1 top-7 h-8 w-8 text-gray-500 hover:text-gray-700"
                onClick={() => setShowPassword(!showPassword)}
                disabled={isLoading}
              >
                {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
              </Button>
            </div>
            {isRegistering && (
              <div className="relative">
                <Label htmlFor="confirmPassword">Confirmar Senha</Label>
                <Input
                  id="confirmPassword"
                  type={showConfirmPassword ? "text" : "password"}
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="Confirme sua senha"
=======
import { LogIn, Eye, EyeOff } from 'lucide-react';
import { motion } from 'framer-motion';
import { useAuth } from '@/contexts/SupabaseAuthContext';

const LoginPage = () => {
  const { toast } = useToast();
  const { signIn } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleLogin = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    const { error } = await signIn(email, password);
    if (error) {
      toast({
        title: 'Erro no Login',
        description: error.message || 'Usuário ou senha inválidos.',
        variant: 'destructive',
      });
    }
    setIsLoading(false);
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 p-4">
      <div className="w-full max-w-md mx-auto">
        <div className="mb-8 text-center">
          <h1 className="text-3xl sm:text-4xl font-extrabold text-gray-800 drop-shadow-lg">Sistema De Checklist</h1>
        </div>
        <Card className="shadow-2xl">
          <CardHeader>
            <CardTitle className="text-2xl font-bold text-center text-gray-700 flex items-center justify-center">
              <LogIn className="h-7 w-7 mr-2 text-purple-600" />
              Login
            </CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleLogin} className="space-y-6">
              <div>
                <Label htmlFor="email">E-mail</Label>
                <Input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Digite seu e-mail"
                  required
                  className="mt-1"
                  disabled={isLoading}
                />
              </div>
              <div className="relative">
                <Label htmlFor="password">Senha</Label>
                <Input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Digite sua senha"
>>>>>>> e6341e13c18ec2e9698b8bfd0bf48aa94c6d8743
                  required
                  className="mt-1 pr-10"
                  disabled={isLoading}
                />
<<<<<<< HEAD
                 <Button
=======
                <Button
>>>>>>> e6341e13c18ec2e9698b8bfd0bf48aa94c6d8743
                  type="button"
                  variant="ghost"
                  size="icon"
                  className="absolute right-1 top-7 h-8 w-8 text-gray-500 hover:text-gray-700"
<<<<<<< HEAD
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  disabled={isLoading}
                >
                  {showConfirmPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </Button>
              </div>
            )}
            <CardFooter className="pt-6 flex flex-col items-center gap-4">
              <Button type="submit" size="lg" className="w-full bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white px-10 py-3 text-lg" disabled={isLoading}>
                {isLoading ? (
                  <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                  >
                    {isRegistering ? <Save className="mr-2 h-5 w-5" /> : <LogIn className="mr-2 h-5 w-5" />}
                  </motion.div>
                ) : (
                  isRegistering ? <Save className="mr-2 h-5 w-5" /> : <LogIn className="mr-2 h-5 w-5" />
                )}
                {isRegistering ? "Criar Conta" : "Entrar"}
              </Button>
              {!isRegistering && (
                <Button type="button" variant="link" onClick={() => {setIsRegistering(true); setUsername(''); setPassword('');}} disabled={isLoading}>
                  Não tem uma conta? Crie uma agora!
                </Button>
              )}
            </CardFooter>
          </form>
        </CardContent>
      </Card>
      <p className="text-xs text-gray-500 mt-6">
        {isRegistering ? "Após criar, você será direcionado para o login." : "Acesso exclusivo para administração."}
      </p>
    </motion.div>
=======
                  onClick={() => setShowPassword(!showPassword)}
                  disabled={isLoading}
                >
                  {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </Button>
              </div>
              <CardFooter className="pt-6 flex flex-col items-center gap-4">
                <Button type="submit" size="lg" className="w-full bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white px-10 py-3 text-lg" disabled={isLoading}>
                  {isLoading ? (
                    <motion.div
                      animate={{ rotate: 360 }}
                      transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                    >
                      <LogIn className="mr-2 h-5 w-5" />
                    </motion.div>
                  ) : (
                    <LogIn className="mr-2 h-5 w-5" />
                  )}
                  Entrar
                </Button>
              </CardFooter>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
>>>>>>> e6341e13c18ec2e9698b8bfd0bf48aa94c6d8743
  );
};

export default LoginPage;