import Image from 'next/image'
import { CardWithHeaderComponent } from './components/cards/CardWithHeaderComponent'
import { TextComponent } from './components/text/TextComponent'
import { enumTextTags, Quote } from '@/constants/types'
import { InfoCardComponent } from './components/cards/InfoCardComponent'
import { DataCardComponent } from './components/cards/DataCardComponent'
import { LastNewsComponent } from './components/ui/LastNewsComponent'
import useUtilsStore from '@/store/useUtilsStore'
export const dynamic = 'force-dynamic'

/*
Input: None, although it uses a store to fetch data
Output: The landing page of the website, including a welcome message, a header image, and several cards with information
Return value: a React component that renders the home page
Function: Creates a home page component
Variables: dailyQuote, RandomFact, items, dataCard, dataRamdomCard
Date: 28 - 05 - 2025
Author: Gerardo Omar Rodriguez Ramirez
*/

export default async function Home() {
  const dailyQuote: Quote = await useUtilsStore.getState().getDailyQuote()
  const RandomFact: string = await useUtilsStore.getState().getRandomFact()

  const items = [
    {
      title: 'Noticias',
      icon: 'NewspaperIcon',
      info: `Mantente al día con los eventos más recientes y las actualizaciones del mundo tecnológico y académico.
       Explora nuestras noticias para estar siempre informado.`,
      href: 'news',
      type: 2
    },
    {
      title: 'Ejercicios',
      icon: 'ListBulletIcon',
      info: `Pon a prueba tus habilidades con nuestra amplia colección de ejercicios diseñados para fortalecer tus conocimientos en programación
       y resolver problemas desafiantes.`,
      href: 'exercises',
      type: 0
    },
    {
      title: 'Apuntes',
      icon: 'BookOpenIcon',
      info: `Accede a una variedad de apuntes detallados que te ayudarán a consolidar tus conocimientos y
       profundizar en conceptos clave para tu aprendizaje.`,
      href: 'note',
      type: 1
    }
  ]

  const dataCard = {
    title: 'Cita del dia',
    info: `“${dailyQuote.phrase}”`,
    autor: dailyQuote.author
  }

  const dataRamdomCard = {
    title: 'Dato aleatorio',
    info: `“${RandomFact}”`,
    image: 'images/dumie-data.png'
  }

  return (
    <main className='flex min-h-screen flex-col items-center mt-16 gap-8'>
      <section className='flex relative w-full h-[90vw] lg:h-[50vw] items-stretch'>
        <Image
          src='/images/Portada_Portal_lCPC.jpg'
          alt='Logo'
          fill
          priority
          className='object-cover object-top -z-10'
        />
        <div className='h-40 w-full bg-gradient-to-t from-white self-end'></div>
      </section>
      <CardWithHeaderComponent
        title={'¡Bienvenido a la comunidad de desarrolladores de software!'}
        comments={`Esta página ha nacido con el propósito de recoger de forma libre y gratuita 
material de preparación para el Concurso Universitario Internacional de Programación (ICPC por sus siglas en inglés) organizado por la ACM. 
Encontrarás dicho material organizado por categorías con unidades teóricas, ejercicios resueltos y 
ejercicios propuestos de diferentes niveles.`}
        className='z-10 -mt-36 shadow-lg max-w-4xl'
      />

      <div className='flex flex-col px-5 gap-4'>
        <TextComponent
          tag={enumTextTags.h3}
          sizeFont='s20'
          className='font-medium'>
          La resolución de problemas
        </TextComponent>
        <TextComponent
          tag={enumTextTags.p}
          sizeFont='s12'
          className='max-w-4xl'>
          La preparación para la resolución de problemas es un camino arduo y difícil, sobre todo al principio, pero la recompensa de
          encontrar la solución a un problema suple con creces el esfuerzo empleado.
        </TextComponent>

        <div className='flex flex-col gap-4 lg:flex-row'>
          {items.map((item, index) => (
            <InfoCardComponent
              key={index}
              title={item.title}
              icon={item.icon}
              info={item.info}
              href={item.href}
              type={item.type}
            />
          ))}
        </div>
      </div>

      <div className='flex flex-col md:flex-row-reverse gap-4 h-full'>
        <div className='flex flex-col gap-4 my-7 px-4 md:px-0 md:pr-4 w-full md:w-1/3'>
          <DataCardComponent
            title={dataCard.title}
            info={dataCard.info}
            autor={dataCard.autor}
          />
          <DataCardComponent
            title={dataRamdomCard.title}
            info={dataRamdomCard.info}
          />
        </div>
        <div className='px-4 md:px-0 md:pl-4 h-full w-full'>
          <LastNewsComponent />
        </div>
      </div>
    </main>
  )
}
