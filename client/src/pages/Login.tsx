import { useState } from 'react';
import { heroSectionData } from '../assets/assets';
import { Link } from 'react-router-dom';
import { BikeIcon, EyeIcon, EyeOffIcon, LockIcon, MailIcon, UserIcon } from 'lucide-react';
import { LoaderIcon } from 'react-hot-toast';

const Login = () => {
    const [isLogin, setIsLogin] = useState(true);
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [showPassword, setShowPassword] = useState(false);

    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const handleSubmit = async (e: React.SubmitEvent) => {
        e.preventDefault();
        setLoading(true);
        setTimeout(() => {
            window.location.href = '/';
        }, 1000);
    };
    return (
        <div className='min-h-screen flex'>
            {/* left-side */}
            <div className=' hidden lg:flex lg:w-1/2 bg-app-green  relative items-center justify-center'>
                <img
                    src={heroSectionData.hero_image}
                    alt='background image for login'
                    aria-label=' background image for login'
                    className=' absolute inset-0 object-cover h-full bg-center opacity-10 '
                />
                <div className=' relative text-center px-12'>
                    <h2 className=' text-4xl text-semibold text-white mb-4'>Welcome back to Instacart</h2>
                    <p className='text-white/60 font-serif text-xl max-w-sm mx-auto"'>Fresh groceries and organic produce, delivered to your doorstep.</p>
                </div>
            </div>
            {/* right-side */}
            <div className='flex-1 flex-center px-4 py-2 bg-app-cream'>
                <div className='w-full max-w-md'>
                    {/* header  form  */}
                    <div className='text-center mb-8'>
                        <Link to='/' className='inline-flex items-center gap-2 mb-6'>
                            <BikeIcon className='size-8 text-app-green' /> <span className='text-3xl font-semibold text-app-green'>Instacart</span>
                        </Link>
                        <h1 className='text-2xl font-semibold text-app-green mb-2'>{isLogin ? 'Sign in to your account' : 'Sign up For a new account'}</h1>
                        <p className=' text-sm text-app-text-light"'>
                            {isLogin ? "Don't have an account?" : 'Already have an account?'}{' '}
                            <button className=' text-orange-500 ml-1  font-semibold hover:text-orange-600 transition-colors" >' onClick={() => setIsLogin(!isLogin)}>
                                {isLogin ? 'Create an account' : 'Sign In'}
                            </button>
                        </p>
                    </div>
                    {/* form for sing in ans signup  */}
                    <form onSubmit={handleSubmit} className='space-y-6'>
                        {!isLogin && (
                            <div>
                                <label htmlFor='name' className='text-sm flex flex-col gap-1'>
                                    {' '}
                                    Name
                                    <div className='relative'>
                                        <UserIcon className='absolute left-3.5 top-1/2 -translate-y-1/2 size-4 text-app-text-light' />
                                        <input
                                            type='text'
                                            id='name'
                                            value={name}
                                            onChange={(e) => setName(e.target.value)}
                                            required
                                            placeholder='Enter your name'
                                            className='w-full rounded-xl pl-10 pr-4 py-3 text-sm bg-white border  not-focus:border-app-border transition-all'
                                        />
                                    </div>
                                </label>
                            </div>
                        )}
                        <label htmlFor='email' className='text-sm flex flex-col gap-1'>
                            {' '}
                            Email Address
                            <div className='relative'>
                                <MailIcon className='absolute left-3.5 top-1/2 -translate-y-1/2 size-4 text-app-text-light' />
                                <input
                                    type='email'
                                    id='email'
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    required
                                    placeholder='Enter your email'
                                    className='w-full rounded-xl pl-10 pr-4 py-3 text-sm bg-white border  not-focus:border-app-border transition-all'
                                />
                            </div>
                        </label>
                        <label htmlFor='email' className='text-sm flex flex-col gap-1'>
                            {' '}
                            Password
                            <div className='relative'>
                                <LockIcon className='absolute left-3.5 top-1/2 -translate-y-1/2 size-4 text-app-text-light' />
                                <input
                                    type={showPassword ? 'text' : 'password'}
                                    id='password'
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    required
                                    placeholder='Enter your password'
                                    className='w-full rounded-xl pl-10 pr-4 py-3 text-sm bg-white border  not-focus:border-app-border transition-all'
                                />
                                <button
                                    type='button'
                                    className='absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors'
                                    onClick={() => {
                                        setShowPassword(!showPassword);
                                    }}
                                >
                                    {showPassword ? <EyeOffIcon size={18} /> : <EyeIcon size={18} />}
                                </button>
                            </div>
                        </label>
                        <button
                            type='submit'
                            disabled={loading}
                            className=' flex flex-center w-full py-3 bg-green-950 w-full text-white font-semibold rounded-xl hover:bg-green-900 transition-colors disabled:opacity-50'
                        >
                            {loading ? <LoaderIcon className='size-8 animate-spin' /> : isLogin ? 'Sign In' : 'Sign Up'}
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default Login;
