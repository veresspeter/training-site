pipeline {
  agent {
    docker {
      image 'node:6-alpine'
    }

  }
  stages {
    stage('FE build') {
      steps {
        sh 'npm install'
        sh 'npm run build'
      }
    }

  }
}