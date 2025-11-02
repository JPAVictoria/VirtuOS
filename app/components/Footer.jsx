'use client'

import { AnimatedThemeToggler } from '@/components/ui/animated-theme-toggler'

export default function Footer() {
  const members = ['Zozobrado', 'Osio', 'Victoria', 'Magdurulan', 'Opiana']

  return (
    <footer className='fixed bottom-0 left-0 w-full bg-white dark:bg-neutral-950 border-t border-neutral-200 dark:border-neutral-800 z-40'>
      <div className='max-w-7xl mx-auto px-4 sm:px-6 py-3 sm:py-4'>
        {/* Desktop Layout */}
        <div className='hidden md:flex items-center justify-between'>
          {/* Left: Team Members */}
          <div className='flex items-center gap-1 text-sm text-neutral-600 dark:text-neutral-400'>
            {members.map((name, i) => (
              <span key={i} className='flex items-center'>
                {name}
                {i < members.length - 1 && <span className='mx-2 text-neutral-400 dark:text-neutral-600'>•</span>}
              </span>
            ))}
          </div>

          {/* Center: Theme Toggler */}
          <div className='absolute left-1/2 -translate-x-1/2'>
            <AnimatedThemeToggler className='cursor-pointer p-2 rounded-full hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-all' />
          </div>

          {/* Right: Professor */}
          <div className='text-sm font-medium text-neutral-700 dark:text-neutral-300'>
            Prof. Michael Eugene Laureano
          </div>
        </div>

        {/* Mobile Layout */}
        <div className='md:hidden space-y-3'>
          {/* Top Row: Theme Toggler */}
          <div className='flex justify-center'>
            <AnimatedThemeToggler className='cursor-pointer p-2 rounded-full hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-all' />
          </div>

          {/* Middle Row: Team Members */}
          <div className='flex flex-wrap justify-center gap-x-2 gap-y-1 text-xs text-neutral-600 dark:text-neutral-400'>
            {members.map((name, i) => (
              <span key={i} className='flex items-center'>
                {name}
                {i < members.length - 1 && <span className='mx-1 text-neutral-400 dark:text-neutral-600'>•</span>}
              </span>
            ))}
          </div>

          {/* Bottom Row: Professor */}
          <div className='text-xs font-medium text-center text-neutral-700 dark:text-neutral-300'>
            Prof. Michael Eugene Laureano
          </div>
        </div>
      </div>
    </footer>
  )
}
