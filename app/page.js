'use client'

import { useState, useRef, useEffect } from 'react'
import { Terminal, TypingAnimation } from '@/components/ui/terminal'
import { executeCommand } from './components/CommandHandler'
import Footer from './components/Footer'

export default function Home() {
  const [currentUser, setCurrentUser] = useState('guest')
  const [securityLogs, setSecurityLogs] = useState([])
  const [terminalLines, setTerminalLines] = useState([
    'VirtOS Security Terminal v1.0',
    'Type "help" for available commands',
    ''
  ])
  const [inputValue, setInputValue] = useState('')
  const inputRef = useRef(null)

  const addSecurityLog = (message) => {
    const time = new Date().toLocaleTimeString()
    setSecurityLogs((prev) => [...prev, `[${time}] ${message}`])
  }

  const handleCommand = (cmd) => {
    if (!cmd.trim()) return

    // Add the command to terminal
    setTerminalLines((prev) => [...prev, `${currentUser}@virtuos:~$ ${cmd}`])

    // Execute command
    const result = executeCommand(cmd, currentUser, addSecurityLog)

    // Handle clear - clear both terminal and security logs
    if (result.action === 'clear') {
      setTerminalLines(['VirtOS Security Terminal v1.0', 'Type "help" for available commands', ''])
      setSecurityLogs([])
      setInputValue('')
      return
    }

    // Add outputs
    setTerminalLines((prev) => [...prev, ...result.outputs, ''])

    // Handle user change
    if (result.newUser) {
      setCurrentUser(result.newUser)
    }

    // Clear input
    setInputValue('')
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    handleCommand(inputValue)
  }

  const runDemo = () => {
    setTerminalLines(['VirtOS Security Terminal v1.0', 'Type "help" for available commands', ''])
    setSecurityLogs([])
    setCurrentUser('guest')

    const commands = [
      'whoami',
      'ls',
      'cat readme.txt',
      'cat config.sys',
      'rm config.sys',
      'sudo rm config.sys',
      'install malware.exe',
      'login admin',
      'sudo rm config.sys',
      'install secure-app'
    ]

    let delay = 0
    let user = 'guest'

    commands.forEach((cmd) => {
      setTimeout(() => {
        setTerminalLines((prev) => [...prev, `${user}@virtuos:~$ ${cmd}`])

        setTimeout(() => {
          const result = executeCommand(cmd, user, addSecurityLog)

          setTerminalLines((prev) => [...prev, ...result.outputs, ''])

          if (result.newUser) {
            user = result.newUser
            setCurrentUser(result.newUser)
          }
        }, 800)
      }, delay)
      delay += 2000
    })
  }

  return (
    <div className='min-h-screen flex flex-col bg-white dark:bg-neutral-950 pb-32 sm:pb-24'>
      <div className='flex-1 flex items-center justify-center p-4 sm:p-6'>
        <div className='w-full max-w-4xl'>
          {/* Header Section - Responsive */}
          <div className='mb-4 sm:mb-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4'>
            <div className='flex-1'>
              <h1 className='text-2xl sm:text-3xl font-bold text-black dark:text-white mb-2'>
                VirtuOS: OS Security Terminal Simulator
              </h1>
              <p className='text-sm sm:text-base text-gray-600 dark:text-gray-400'>
                Demonstrating Access Control, Privilege Management & Security Logging
              </p>
            </div>
            <button
              onClick={runDemo}
              className='w-full sm:w-auto px-6 py-2 bg-black dark:bg-white text-white dark:text-black rounded text-sm font-medium hover:bg-gray-800 dark:hover:bg-gray-200 transition-colors'
            >
              Run Demo
            </button>
          </div>

          {/* Terminal Section */}
          <div className='space-y-3 sm:space-y-4'>
            <Terminal className='w-full max-w-full' sequence={false} startOnView={false}>
              {terminalLines.map((line, index) => (
                <TypingAnimation key={index} duration={20}>
                  {line}
                </TypingAnimation>
              ))}
            </Terminal>

            {/* Interactive Input - Responsive */}
            <form
              onSubmit={handleSubmit}
              className='flex items-center gap-2 p-3 sm:p-4 bg-white dark:bg-black border border-gray-300 dark:border-gray-700 rounded-lg font-mono text-xs sm:text-sm'
            >
              <span className='text-green-400 hidden sm:inline'>{currentUser}@virtuos:~$</span>
              <span className='text-green-400 sm:hidden'>{currentUser}$</span>
              <input
                ref={inputRef}
                type='text'
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                className='flex-1 bg-transparent outline-none text-black dark:text-white'
                placeholder='Type a command...'
                autoFocus
              />
            </form>
          </div>

          {/* Security Log - Responsive */}
          {securityLogs.length > 0 && (
            <div className='mt-4 sm:mt-6 p-3 sm:p-4 border border-gray-300 dark:border-gray-700 rounded-lg bg-gray-50 dark:bg-neutral-900'>
              <h3 className='text-black dark:text-white font-bold mb-2 sm:mb-3 text-xs sm:text-sm'>SECURITY LOG</h3>
              <div className='space-y-1 text-xs font-mono text-red-600 dark:text-red-400 max-h-32 sm:max-h-40 overflow-y-auto'>
                {securityLogs.map((log, index) => (
                  <div key={index} className='break-words'>
                    {log}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
      <Footer />
    </div>
  )
}
