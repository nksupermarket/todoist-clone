# todoist clone
live demo: https://lookingcoolonavespa.github.io/todoist-clone/dist/

## app in action
![screenshot of home page](https://i.postimg.cc/7P38pMqW/Screenshot-from-2021-12-30-20-33-00.png)

![screenshot of upcoming](https://i.postimg.cc/ncT8LFjK/Screenshot-from-2021-12-30-20-33-31.png)

![screenshot of project page](https://i.postimg.cc/wT98HyvT/Screenshot-from-2021-12-30-20-33-43.png)

![screenshot of comments popup](https://i.postimg.cc/bJjtYDvL/Screenshot-from-2021-12-30-21-01-39.png)


## features
- keep track of all your todos in one place
- set todos to 1 of 4 priority levels
- edit, make comments on, or delete todos
- make projects to group together todos
- edit, make comments on, or delete projects
- sort todos by due date, alphabetically, or by priority
- home screen greets you with the todos due that day and any overdue todos you may have
- check any todos you have due in the upcoming 7 days in the 'upcoming' tab
- easily find your todos or projects with the search function
- fully responsive

## tech stack
- vanilla js
- html/css

## how the code is orgranized
- every distinct "block" is seperated into its own module (eg. header module, menu module, content module, popups module)
- the modules would house all its instances (eg. popups module would hold the comment popup, sort popup, and so on; the content module houses the project view, today view, and upcoming view)
- the modules also house any buttons located inside the "block"
- dom.js pulls everything together and is where all the events + event listeners are located 

## challenges i faced
- **organizing the code** - I should have seperated my dom elements from my logic. I could have written my methods to take in dom elements as arguments. This would have led to more manageable code I think. Feels like code would be more reusable and easier to read had I done it that way.
- **state management** - Looking back at my code, I think one of the biggest flaws of how I wrote it was how I managed state. I didn't want to have global variables and back then I didn't understand closures that well - which meant I had stored my state in my dom via classes. Real ugly design which led to a lot of extra code. If I were to update my code, this would be on top of my list.
