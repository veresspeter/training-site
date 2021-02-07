pipeline {
  agent any
  stages {
    stage('FE build') {
      steps {
        sh 'npm install'
        sh 'npm run build'
      }
    }

  }
}