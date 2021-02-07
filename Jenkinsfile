pipeline {
  agent any
  stages {
    stage('FE build') {
      steps {
        sh 'apt install npm'
        sh 'npm install'
        sh 'npm run build'
      }
    }

  }
}