'use client'
import { useForm, SubmitHandler } from 'react-hook-form';
import CheckboxComponent from '../components/forms/CheckboxComponent'
import TextFieldComponent from '../components/forms/TextFieldComponent'
import { BasicPanelComponent } from '../components/panels/BasicPanelComponent'
import LogoComponent from '../components/LogoComponent'
import { enumTextTags } from '@/constants/types'
import SubmitComponent from '../components/forms/SubmitComponent'
import { TextComponent } from '../components/text/TextComponent'
import useStore from '@/store/useStore'
import { useRouter } from 'next/navigation'
import { toast } from 'sonner';


export default function Home() {
  const login = useStore((state) => state.login);
  const router = useRouter();
  const methods = useForm();

  const onSubmit: SubmitHandler<{ username: string; password: string }> = async (data) => {
    try {
      await login(data.username, data.password);
      router.push('/');
      toast.success('Inicio de sesión exitoso', { 
        duration: 5000,
        style: {
          backgroundColor: 'green',
          color: '#ffffff'
        }
      });
    } catch (error) {
      toast.error(
        'Error al iniciar sesión, verifica tus credenciales',{
        duration: 5000,
        style: {
          backgroundColor: '#ff0000',
          color: '#ffffff'
        }
      });
    }
  };

  return (
    <main
      className={`margin-auto flex h-full min-h-screen w-full max-w-3xl place-items-center justify-between md:mx-auto
      md:px-4 lg:h-auto lg:w-2/3 lg:px-8`}>
      <BasicPanelComponent backgroundColor='bg-gray-300 dark:bg-dark-primary w-full shadow-lg'>
        <div className='grid grid-cols-1 place-items-center justify-between'>
          <LogoComponent size={150} />
          <TextComponent
            tag={enumTextTags.h3}
            sizeFont='s36'
            className='dark:text-dark-accent'>
            Inicio de sesión
          </TextComponent>
        </div>
        <form
          onSubmit={methods.handleSubmit(onSubmit as any)}
          className='grid grid-cols-1 place-items-center justify-between'>
          <TextFieldComponent
            labelText='Correo electrónico / Nombre de usuario'
            register={methods.register}
            fieldName='username'
            auto='username'
            type='text'
            necessary={true}
            id='username'
          />
          <TextFieldComponent
            labelText='Contraseña'
            register={methods.register}
            fieldName='password'
            auto='current-password'
            type='password'
            necessary={true}
            id='password'
          />
          <CheckboxComponent
            labelText='Recuérdame'
            register={methods.register}
            fieldName='rememberMe'
          />
          <SubmitComponent text='Iniciar sesión' />
          <a href='/forgot'>
          <TextComponent className='dark:text-dark-accent hover:text-dark-accent hover:dark:text-complementary underline'>
              Olvidé mi contraseña
            </TextComponent>
          </a>
        </form>
      </BasicPanelComponent>
    </main>
  )
}
