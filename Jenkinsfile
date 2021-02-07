pipeline {
  agent {
    docker {
      image 'node:6-alpine'
    }

  }
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