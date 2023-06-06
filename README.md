# distributedSystemsProject

## prerequisite software

1. kubectl
2. helm
4. docker desktop

## Get started
1. Add containers.prod 127.0.0.1 to your hosts file (/etc/hosts)
2. In your terminal, execute command: 
```zsh 
  kubectl port-forward --namespace default svc/postgresql 5432:5432  
```
3. cd into server folder, execute commaind:
```zsh
  npm install
  npm start
```
5. cd into client folder, execute commaind:
```zsh
  npm install
  npm start
```

#Enjoy!!!
