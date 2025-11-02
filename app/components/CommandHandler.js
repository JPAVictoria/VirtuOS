// User and file system data
export const users = [
  {
    name: 'guest',
    role: 'guest',
    privileges: ['read'],
    password: null
  },
  {
    name: 'user',
    role: 'user',
    privileges: ['read', 'write'],
    password: 'user123'
  },
  {
    name: 'admin',
    role: 'admin',
    privileges: ['read', 'write', 'execute', 'delete'],
    password: 'admin123'
  }
]

export const files = [
  {
    name: 'readme.txt',
    owner: 'admin',
    permissions: 'rwxr--r--',
    content: 'Welcome to VirtOS! This is a public readme file.'
  },
  {
    name: 'config.sys',
    owner: 'admin',
    permissions: 'rw-------',
    content: 'SYSTEM CONFIGURATION FILE - Contains critical system settings.'
  },
  {
    name: 'user_data.txt',
    owner: 'user',
    permissions: 'rw-rw-r--',
    content: 'User personal data and preferences stored here.'
  },
  {
    name: 'public.txt',
    owner: 'guest',
    permissions: 'rw-rw-rw-',
    content: 'Public file accessible to all users. Feel free to read!'
  },
  {
    name: 'passwords.db',
    owner: 'admin',
    permissions: 'rw-------',
    content: 'ENCRYPTED PASSWORD DATABASE - Access restricted to admin only.'
  }
]

// Permission checking logic
export const hasPermission = (currentUser, command) => {
  const user = users.find((u) => u.name === currentUser)

  if (command.startsWith('rm') || command.startsWith('delete')) {
    return user.privileges.includes('delete')
  }
  if (command.startsWith('install') || command.startsWith('execute')) {
    return user.privileges.includes('execute')
  }
  if (command.startsWith('edit') || command.startsWith('modify')) {
    return user.privileges.includes('write')
  }
  return true
}

// Command execution logic
export const executeCommand = (input, currentUser, addSecurityLog) => {
  const outputs = []
  const [cmd, ...args] = input.toLowerCase().split(' ')
  const arg = args.join(' ')

  const addOutput = (text) => {
    outputs.push(text)
  }

  switch (cmd) {
    case 'help':
      addOutput('Available Commands:')
      addOutput('  login <user>     - Switch user (guest, user, admin)')
      addOutput('  whoami           - Display current user info')
      addOutput('  ls               - List files with permissions')
      addOutput('  cat <file>       - View file contents')
      addOutput('  rm <file>        - Delete file (admin only)')
      addOutput('  sudo <command>   - Execute with elevated privileges')
      addOutput('  install <app>    - Install application')
      addOutput('  clear            - Clear terminal screen')
      break

    case 'login':
      if (!arg) {
        addOutput('Usage: login <username>')
        addOutput('Available users: guest, user, admin')
      } else if (users.find((u) => u.name === arg)) {
        const user = users.find((u) => u.name === arg)
        addOutput(`Logged in as ${arg}`)
        addOutput(`Role: ${user.role} | Privileges: ${user.privileges.join(', ')}`)
        return { outputs, action: 'login', newUser: arg }
      } else {
        addOutput(`User "${arg}" not found`)
        addSecurityLog(`Failed login attempt for user: ${arg}`)
      }
      break

    case 'whoami':
      const userInfo = users.find((u) => u.name === currentUser)
      addOutput(`Username: ${currentUser}`)
      addOutput(`Role: ${userInfo.role}`)
      addOutput(`Privileges: ${userInfo.privileges.join(', ')}`)
      break

    case 'ls':
      addOutput('Listing directory contents...')
      addOutput('')
      addOutput('PERMISSIONS  OWNER    FILENAME')
      addOutput('─────────────────────────────────────')
      files.forEach((file) => {
        addOutput(`${file.permissions}  ${file.owner.padEnd(8)} ${file.name}`)
      })
      break

    case 'cat':
      if (!arg) {
        addOutput('Usage: cat <filename>')
      } else {
        const file = files.find((f) => f.name === arg)
        if (!file) {
          addOutput(`cat: ${arg}: No such file or directory`)
        } else if (file.owner !== currentUser && currentUser !== 'admin' && file.permissions.charAt(6) !== 'r') {
          addOutput(`cat: ${arg}: Permission denied`)
          addOutput('ACCESS DENIED: Insufficient privileges to read this file')
          addSecurityLog(`${currentUser} attempted to read ${arg} (DENIED - insufficient permissions)`)
        } else {
          addOutput(`Reading file: ${arg}`)
          addOutput('')
          addOutput(file.content)
        }
      }
      break

    case 'rm':
    case 'delete':
      if (!arg) {
        addOutput('Usage: rm <filename>')
      } else if (!hasPermission(currentUser, input)) {
        addOutput(`rm: cannot remove '${arg}': Permission denied`)
        addOutput('ACCESS DENIED: Insufficient privileges to delete files')
        addSecurityLog(`${currentUser} attempted to delete ${arg} (DENIED - insufficient privileges)`)
      } else if (currentUser !== 'admin') {
        addOutput(`rm: cannot remove '${arg}': Operation not permitted`)
        addOutput('ACCESS DENIED: Only admin can delete system files')
        addSecurityLog(`${currentUser} attempted to delete ${arg} (DENIED - not admin)`)
      } else {
        addOutput(`Removing file: ${arg}`)
        addOutput(`File '${arg}' successfully deleted`)
      }
      break

    case 'sudo':
      if (!arg) {
        addOutput('Usage: sudo <command>')
      } else if (currentUser !== 'admin') {
        addOutput('sudo: permission denied')
        addOutput('ACCESS DENIED: Unauthorized privilege escalation attempt')
        addOutput('⚠️  SECURITY ALERT: This incident will be reported')
        addSecurityLog(`CRITICAL: ${currentUser} attempted privilege escalation via sudo ${arg}`)
      } else {
        addOutput(`[sudo] password for ${currentUser}: ********`)
        addOutput(`Executing with elevated privileges: ${arg}`)
      }
      break

    case 'install':
      if (!arg) {
        addOutput('Usage: install <application>')
      } else if (!hasPermission(currentUser, input)) {
        addOutput(`install: permission denied`)
        addOutput('ACCESS DENIED: Insufficient privileges to install applications')
        addSecurityLog(`${currentUser} attempted to install ${arg} (DENIED)`)
      } else {
        addOutput(`Installing ${arg}...`)
        addOutput(`Package ${arg} installed successfully`)
      }
      break

    case 'clear':
      return { outputs: [], action: 'clear' }

    default:
      addOutput(`bash: ${cmd}: command not found`)
      addOutput('Type "help" for a list of available commands')
  }

  return { outputs, action: 'output' }
}
