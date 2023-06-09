import Image from 'next/image'
import AppPreviewImg from '../assets/app-nlw-copa-preview.png'
import LogoImg from '../assets/logo.svg'
import UsersAvatarExampleImg from '../assets/users-avatar-example.png'
import iconCheckImg from '../assets/icon-check.svg'
import { api } from '../lib/axios';
import { FormEvent, useState } from 'react';

interface HomeProps {
  poolCount: number;
  guessCount: number;
  userCount: number;
}

export default function Home(props: HomeProps) {

  const [poolTitle, setPoolTitle] = useState('')

  async function createPool(event: FormEvent){
    event.preventDefault()

    try {
      const response = await api.post('/pools', {
        title: poolTitle,
      });

      const { code } = response.data

      await navigator.clipboard.writeText(code)

      setPoolTitle('')

      alert('Bolão criado com sucesso, o código foi copiado para a área de transferência!')

      setPoolTitle('')

    }
    catch (error) {
      console.log(error)
      alert('Erro ao criar o bolão, tente novamente!')
    }   
  }

  return (
    <div className="max-w-[1124px] h-screen mx-auto grid grid-cols-2 items-center gap-28">
      <main>
        <Image 
          src={LogoImg}
          alt="Logo da Aplicação"
        />

        <h1 className="mt-14 text-5xl text-white font-bold leading-tight">Crie seu próprio bolão da copa e compartilhe entre amigos!</h1>
        
        <div className="mt-10 flex items-center gap-2 text-gray-100 font-bold text-xl leading-relaxed">
          <Image 
          src={UsersAvatarExampleImg}
          alt=""
          />

          <strong>
            <span className="text-ignite-500">+{props.userCount}</span> pessoas já estão usando
          </strong>
        </div>

        <form onSubmit={createPool} className="mt-10 flex gap-2">
          <input onChange={event => setPoolTitle(event.target.value)} value={poolTitle} className="flex-1 px-6 py-4 rounded bg-gray-800 text-gray-100 border border-gray-600 text-sm" required type="text" placeholder="Qual nome do seu bolão?"/>
          <button className="px-6 py-4 rounded bg-yellow-500 text-sm text-gray-900 font-bold uppercase hover:bg-yellow-700" type="submit">Criar meu bolão</button>
        </form>

        <p className="mt-4 text-sm leading-relaxed text-gray-300">Após criar seu bolão, você receberá um código único que poderá usar para convidar outras pessoas 🚀</p>

        <div className="mt-10 pt-10 border-t border-gray-600 flex items-center justify-between text-gray-100">
          <div className="flex items-center gap-6">
            <Image 
              src={iconCheckImg}
              alt=""
            />
            <div className="flex flex-col">
              <span className="font-bold text-2xl">+{props.poolCount}</span>
              <span>Bolões criados</span>
            </div>
            
          </div>

          <div className="w-px h-14 bg-gray-600"/>

          <div className="flex items-center gap-6">
            <Image 
              src={iconCheckImg}
              alt=""
            />
            <div className="flex flex-col">
              <span className="font-bold text-2xl">+{props.guessCount}</span>
              <span>palpites enviados</span>
            </div>
          </div>

        </div>

      </main>

      <Image 
        src={AppPreviewImg}
        alt="Dois celulares exibindo uma prévia da aplicação móvel do NLW Copa"
        quality={100}
      />

    </div>

  )
}

export const getServerSideProps = async () => {
  const [poolCountResponse, guessCountResponse, userCountResponse] = await Promise.all([
    api('pools/count'),
    api('guesses/count'),
    api('users/count'),
  ])

  return {
    props: {
      poolCount: poolCountResponse.data.count,
      guessCount: guessCountResponse.data.count,
      userCount: userCountResponse.data.count,
    }
  }
}
