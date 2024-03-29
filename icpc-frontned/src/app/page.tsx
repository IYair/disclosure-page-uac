import Image from 'next/image'
import { CardWithHeaderComponent } from './components/cards/CardWithHeaderComponent'
import { TextComponent } from './components/text/TextComponent'
import { enumTextTags } from '@/constants/types'
import { InfoCardComponent } from './components/cards/InfoCardComponent'
import { DataCardComponent } from './components/cards/DataCardComponent'
import { LastNewsComponent } from './components/ui/LastNewsComponent'

export default function Home() {
  //TODO: Agregar descripciones pertinentes a cada item
  const items = [
    {
      title: 'Noticias',
      icon: 'NewspaperIcon',
      info: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit.',
      href: '#',
      exercises: 126
    },
    {
      title: 'Ejercicios',
      icon: 'ListBulletIcon',
      info: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit.',
      href: '#',
      exercises: 255
    },
    {
      title: 'Apuntes',
      icon: 'BookOpenIcon',
      info: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit.',
      href: '#',
      exercises: 150
    }
  ]

  const dataCard = {
    title: 'Cita del dia',
    info: `“El objetivo del rigor no es destruir toda intuición, sino que debería usarse para destruir 
    la mala intuición a la vez que clarificar y elevar la buena intuición.”`,
    autor: 'TERENCE TAO'
  }

  const dataRamdomCard = {
    title: 'Dato aleatorio',
    info: `“El objetivo del rigor no es destruir toda intuición, sino que debería usarse para destruir 
    la mala intuición a la vez que clarificar y elevar la buena intuición.”`,
    autor: 'TERENCE TAO',
    image: 'images/dumie-data.png'
  }

  return (
    <main className='flex min-h-screen flex-col items-center mt-16 gap-8'>
      <section className='flex relative w-full h-[90vw] lg:h-[50vw] dark:invert items-stretch'>
        <Image
          src='/banner-landing.png'
          alt='Logo'
          fill
          priority
          className='object-cover object-top invert -z-10'
        />
        <div className='h-40 w-full bg-gradient-to-t from-white self-end'></div>
      </section>
      <CardWithHeaderComponent
        title={'¡Bienvenido a la comunidad de desarrolladores de software!'}
        comments={`Esta pagina ha nacido con el proposito de recoger de forma libre y gratuita material
de preparacion para olimpiadas de matematicas destinado a alumnos de enseñanza secundaria.
Encontraras dicho material organizado por categorias con unidades teoricas, ejercicios resueltos y ejercicios propuestos 
de diferentes niveles.`}
        className='z-10 -mt-36 shadow-lg max-w-4xl'
      />

      <div className='flex flex-col px-5 gap-4'>
        <TextComponent
          tag={enumTextTags.h3}
          sizeFont='s20'
          className='font-medium'>
          La resolucion de probelmas
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
              exercises={item.exercises}
            />
          ))}
        </div>
      </div>

      <div className='flex flex-col md:flex-row-reverse gap-4 h-full'>
        <div className='flex flex-col gap-4 my-7 px-4 md:px-0 md:pr-4'>
            <DataCardComponent
              title={dataCard.title}
              info={dataCard.info}
              autor={dataCard.autor}
            />
            <DataCardComponent
              title={dataRamdomCard.title}
              info={dataRamdomCard.info}
              autor={dataRamdomCard.autor}
              image={dataRamdomCard.image}
            />
        </div>
        <div className='px-4 md:px-0 md:pl-4 h-full'>
          <LastNewsComponent />
        </div>
      </div>
    </main>
  )
}
