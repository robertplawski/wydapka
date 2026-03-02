WYDAPKA, play on words wydatek - expenditure and apka - application is an application to manage your personal budget / expenditures. 

MOBILE FIRST DESIGN, PWA, LOCAL STORAGE ONLY

TECH STACK:
react 19
pwa progressive web app
shadcn
vite 
tailwindcss

DB:
local storage


USER FLOW:
when first time:
    (save each answer)
    1. ask for budget and currency (eur, pln, usd whatver just visual mark)
    2. ask for spending categories percentage, eg. how much do you want to spend on ->  food, travel, entertainment - whatever, user can enter either a percentage of his budget or a number not bigger than budget
    3. ask how much does he want to save? same as before either a percentage or number 

every other time:
    user is shown a screen, which contains:
        - a graph of expenditures today and overlay with how much did he want to spend
        - breakdown of spending  in percentages and number
        - a list of recent spendings
        - a navbar, which contains:
            a plus button which opens a popup to enter spending with: name (optional), category, amount - which is then added to the responding category 

steps:
    1. create a mock ui with pwa
    2. add function
