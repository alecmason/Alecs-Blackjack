1. game start; initialize dealer hand and player hand
2. player HITS
    1. add another card to player hand
    2. calculate playerCardScore
    3. if playerCardScore > 21 the player busts
3. player STAYS
    1. if the dealersCardScore < 17 continue to add card to dealers hand 
        1. if dealersCardScore > 21 the dealer busts
    2. if the playersCardScore > dealersCardScore && <= 21
        1. player WINS