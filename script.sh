#starts the server up
#run chmod +x script.sh && ./script.sh
#cd backend && npm install && node . 

#Use concurrently instead

npx concurrently "cd backend && npm install && node ." "cd frontend && open index.html"

