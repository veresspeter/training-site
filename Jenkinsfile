pipeline {
  agent none
  stages {
    /*
    stage('Frontend Build') {
      agent {
        docker 'node:12-alpine'
      }
      steps {
        sh 'npm install'
        sh 'npm run build'
      }
    }

    stage('Backend Build') {
      agent {
        docker 'openjdk:8'
      }
      environment {
          DOCKERHUB = credentials('dockerhubId')
          DB = credentials('postgresql')
      }
      steps {
        sh 'chmod go-w+x -R .'
        sh './mvnw package -Pprod -Djib.to.auth.password=$DOCKERHUB_PSW -Djib.to.auth.username=$DOCKERHUB_USR -DbuildNo=$BUILD_NUMBER verify jib:build'
      }
    }
    */

    stage('Deploy') {
        agent any
        steps {
            withCredentials([sshUserPrivateKey(credentialsId: 'aws-frankfurt-default-kp', keyFileVariable: 'SSH_KEY', usernameVariable: 'SSH_USR')]) {
                sh 'echo $SSH_KEY > kp.pem'
                sh 'ssh -oStrictHostKeyChecking=no -i kp.pem ${SSH_USR}@maxmove.hu docker stop maxmove'
                sh 'ssh -i $SSH_KEY ${SSH_USR}@maxmove.hu docker rm maxmove'
                sh 'ssh -i $SSH_KEY ${SSH_USR}@maxmove.hu docker rmi veresspeter/maxmove'
                sh 'ssh -i $SSH_KEY ${SSH_USR}@maxmove.hu docker pull veresspeter/maxmove'
                sh 'ssh -i $SSH_KEY ${SSH_USR}@maxmove.hu docker run --name maxmove -p 80:8080 veresspeter/maxmove'
            }
        }
    }

  }
}
