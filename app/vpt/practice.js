/**
 * Created by jalute on 1/7/16.
 */
angular.module('VPT.practice', ['ngRoute', 'ngSanitize'])

    .config(['$routeProvider', function($routeProvider) {
        console.log("Practice route called...");
        $routeProvider.when('/vpt/practice', {
            templateUrl: 'vpt/practice.html',
            controller: 'PracticeCtrl'
        });

    }])
    // this will return a shuffled deck
    .service('cards', [function() {

        var cardSuits = {Spade: '♠', Hearts: '♥', Diamonds: '♦', Clubs: '♣'};
        var cardValues = {A: 1, 2: 2, 3: 3, 4: 4, 5: 5, 6: 6, 7: 7, 8: 8, 9: 9, 10: 10, J: 11, Q: 12, K: 13};

        /// <summary>
        /// This creates a new deck of 52 cards with no jokers.
        /// </summary>
        /// <returns>An array of Card of size 52 in numeric order</returns>
        /// <remarks>This deck will need to be shuffled</remarks>
        this.createDeck = function() {
            var cards = [];

            for(var suit in cardSuits) {
                if (cardSuits.hasOwnProperty(suit)) {
                    for(var value in cardValues) {
                        var suitColor = '';
                        var mySuit = cardSuits[suit];
                        if (mySuit == '♥') {
                            suitColor = 'red';
                        }
                        else if (mySuit == '♦') {
                            suitColor = 'red';
                        }

                        var card = {
                            rank: value,
                            value: cardValues[value],
                            suit: mySuit,
                            cardOutput: value + mySuit,
                            hold: '.',
                            color: suitColor};
                        cards.push(card);
                    }
                }
            }

            if (cards.length == 52) {
                console.log("successful deck created!")
            }
            return cards;
        };

        /// <summary>
        /// This simulates a standard shuffle where the dealer splits the deck into 2,
        /// then with their thumbs, lift up and slide/merge the two decks together
        /// </summary>
        /// <param name="deck">The deck to shuffle</param>
        /// <param name="NumOfSteps">Number of splits that will be merged together, default is set to 2</param>
        /// <returns>Shuffled Deck</returns>
        this.shuffleSplit = function(deck, NumOfSteps) {
            var NumOfCards = deck.length;
            var shuffled_deck = [];

            for (var start = 0; start < NumOfSteps; start++)
            {
                for (var idx = start; idx < NumOfCards; idx += NumOfSteps)
                {
                    shuffled_deck.push(deck[idx]);
                }
            }

            return shuffled_deck;

        };


        /// <summary>
        /// This debugging function was created to verify that the suffling functions didn't duplicate cards in the deck.
        /// </summary>
        /// <param name="deck">The deck of cards to verify</param>
        /// <param name="iMax">Optional parameter, it will default to the length of the deck.</param>
        /// <returns></returns>
        this.checkForDups = function(deck, iMax) {
            if (iMax == 0) iMax = deck.length;

            for (var idx = 0; idx < iMax - 1; idx++)
            {
                for (var y = idx + 1; y < iMax; y++)
                {
                    if (deck[idx].rank == deck[y].rank && deck[idx].suit == deck[y].suit)
                    {
                        console.log("Duplicate card found at position " + idx + " and " + y);
                        return true;
                    }
                }
            }

            return false;  // everything ok
        };

        /// <summary>
        /// This simulates how a vegas shuffle machine works.  It basically pops out
        /// one card at a time from the start deck from a random spot in the middle
        /// to create a new "random" deck.
        /// </summary>
        /// <param name="deck">The deck to shuffle</param>
        /// <returns>Randomly shuffled deck</returns>
        this.vegasShuffle = function(deck)
        {
            var short_deck = deck;
            var shuffled_deck = [];

            for (var idx = deck.length - 1; idx >= 0; idx += -1)
            {
                if (idx == 0)
                {
                    shuffled_deck[51] = short_deck[0];
                }
                else
                {
                    // pick a random car (number) from the unshuffled deck
                    var z = Math.floor((Math.random() * idx) + 1);
                    //var z = (rr * idx).toFixed(0);  // this trims the decimal

                    shuffled_deck.push(short_deck[z]);

                    // remove card and rebuild short deck

                    var tmp = [];
                    for (var c in short_deck)
                    {
                        if (short_deck.hasOwnProperty(c))
                            if (z != c)
                            {
                                tmp.push(short_deck[c]);
                            }

                    }
                    short_deck = tmp;
                }

            }

            return shuffled_deck;
        };

    }])

    // this service determines the payout
    .service('payout', [function() {

        //var cardValues = {A: 1, 2: 2, 3: 3, 4: 4, 5: 5, 6: 6, 7: 7, 8: 8, 9: 9, 10: 10, J: 11, Q: 12, K: 13};

        var vegasPayouts = {
            PaiGow: 0,
            JacksOrBetterPair: 1,
            TwoPair: 2,
            ThreeOfKind: 3,
            Straight: 4,
            Flush: 6,
            FullHouse: 9,
            FourOfKind: 25,
            StraightFlush: 50,
            RoyalFlush: 250
        };


        /// <summary>
        /// this looks for any pair
        /// </summary>
        /// <param name="sorted_hand">Card values in numeric order</param>
        /// <remarks>The values must be presorted before calling this function</remarks>
        /// <returns>True if pair found</returns>
        /** @type {function(array):boolean} */
        var HasPair = function(sorted_hand)
        {
            for (var idx = 0; idx <= sorted_hand.length - 2; idx++)
            {
                // check for pair
                if (sorted_hand[idx] == sorted_hand[idx + 1])
                {
                    return true;
                }
            }

            return false;
        };

        /** @type {function(array):string} */
        this.InterpretHand = function(hand) {
            var result = this.EvaluateHand(hand);
            //console.log("Evaluated hand: " + result);

            var myOutput = "";

            switch(result) {
                case vegasPayouts.PaiGow:
                    myOutput = "";
                    break;
                case vegasPayouts.Flush:
                    myOutput = "Flush";
                    break;
                case vegasPayouts.FourOfKind:
                    myOutput = "Four of a Kind";
                    break;
                case vegasPayouts.FullHouse:
                    myOutput = "Full House";
                    break;
                case vegasPayouts.JacksOrBetterPair:
                    myOutput = "Jacks or Better";
                    break;
                case vegasPayouts.RoyalFlush:
                    myOutput = "Royal Flush";
                    break;
                case vegasPayouts.Straight:
                    myOutput = "Straight";
                    break;
                case vegasPayouts.StraightFlush:
                    myOutput = "Straight Flush";
                    break;
                case vegasPayouts.ThreeOfKind:
                    myOutput = "Three of a Kind";
                    break;
                case vegasPayouts.TwoPair:
                    myOutput = "Two Pair";
                    break;
                default:
                    myOutput = "unknown";
            }

            return myOutput;

        };

        // this function interprets the hand to return the payout of the 5 card poker hand
        // note: this function will crash if there are not 5 cards in the hand.
        /** @type {function(array, boolean):number} */
        this.EvaluateHand = function(hand, isSorted)
        {

            var sorted_hand = [hand[0].value, hand[1].value, hand[2].value, hand[3].value, hand[4].value];
            var JACK = 11;
            var ACE = 1;

            // insertion sort - this is the fastest way for small arrays
            var value;
            var j;
            if (!isSorted)  {
                for (var i = 1; i < 5; i++)
                {
                    value = sorted_hand[i];
                    j = i - 1;
                    var done = false;
                    do
                    {
                        if (sorted_hand[j] > value)
                        {
                            sorted_hand[j + 1] = sorted_hand[j];
                            j--;
                            if (j < 0) done = true;
                        }
                        else
                            done = true;
                    } while (!done);

                    sorted_hand[j + 1] = value;
                }
            }
            //console.log("sorted_hand", sorted_hand);

            // determine if hand has a pair, this will help performance doing this check first.
            var hasPair = HasPair(sorted_hand);
            //console.log("hasPair? " + hasPair);

            if (sorted_hand[1] == sorted_hand[2] && sorted_hand[1] == sorted_hand[3] && sorted_hand[1] == sorted_hand[4])
            {
                return vegasPayouts.FourOfKind;
            }
            else if (sorted_hand[0] == sorted_hand[1] && sorted_hand[0] == sorted_hand[2] && sorted_hand[0] == sorted_hand[3])
            {
                return vegasPayouts.FourOfKind;
            }
            else if (sorted_hand[0] == sorted_hand[1] && sorted_hand[0] == sorted_hand[2] && sorted_hand[3] == sorted_hand[4])
            {
                return vegasPayouts.FullHouse;
            }
            else if (sorted_hand[0] == sorted_hand[1] && sorted_hand[2] == sorted_hand[3] && sorted_hand[2] == sorted_hand[4])
            {
                return vegasPayouts.FullHouse;
            }
            else if (hasPair == false
                && (sorted_hand[0] + 1 == sorted_hand[1]
                && sorted_hand[1] + 1 == sorted_hand[2]
                && sorted_hand[2] + 1 == sorted_hand[3]
                && sorted_hand[3] + 1 == sorted_hand[4]))
            {
                if (HasFlush(hand))
                    return vegasPayouts.StraightFlush;
                else
                    return vegasPayouts.Straight;
            }
            else if (hasPair == false
                && sorted_hand[0] == ACE   //  cardValues.A
                && (sorted_hand[1] == 10
                && sorted_hand[2] == JACK  //cardValues.J
                && sorted_hand[3] == 12 //cardValues.Q
                && sorted_hand[4] == 13))  //cardValues.K))
            {
                if (HasFlush(hand))
                    return vegasPayouts.RoyalFlush;
                else
                    return vegasPayouts.Straight;
            }
            else if (sorted_hand[0] == sorted_hand[1] && sorted_hand[0] == sorted_hand[2])
            {
                return vegasPayouts.ThreeOfKind;
            }
            else if (sorted_hand[1] == sorted_hand[2] && sorted_hand[1] == sorted_hand[3])
            {
                return vegasPayouts.ThreeOfKind;
            }
            else if (sorted_hand[2] == sorted_hand[3] && sorted_hand[2] == sorted_hand[4])
            {
                return vegasPayouts.ThreeOfKind;
            }
            else if (sorted_hand[0] == sorted_hand[1] && sorted_hand[2] == sorted_hand[3])    //22334
            {
                return vegasPayouts.TwoPair;
            }
            else if (sorted_hand[1] == sorted_hand[2] && sorted_hand[3] == sorted_hand[4])   //23344
            {
                return vegasPayouts.TwoPair;
            }
            else if (sorted_hand[0] == sorted_hand[1] && sorted_hand[3] == sorted_hand[4])   //22344
            {
                return vegasPayouts.TwoPair;
            }
            else if (sorted_hand[0] == sorted_hand[1] && (sorted_hand[0] >= JACK || sorted_hand[0] == ACE))
            {
                return vegasPayouts.JacksOrBetterPair;
            }
            else if (sorted_hand[1] == sorted_hand[2] && sorted_hand[1] >= JACK)
            {
                return vegasPayouts.JacksOrBetterPair;
            }
            else if (sorted_hand[2] == sorted_hand[3] && sorted_hand[2] >= JACK)
            {
                return vegasPayouts.JacksOrBetterPair;
            }
            else if (sorted_hand[3] == sorted_hand[4] && sorted_hand[3] >= JACK)
            {
                return vegasPayouts.JacksOrBetterPair;
            }
            else if (HasFlush(hand))
                return vegasPayouts.Flush;
            else
            // we got nothing
                return vegasPayouts.PaiGow;
        };


        /// <summary>
        /// This checks if the cards passed in are the same suit
        /// </summary>
        /// <param name="hand">The hand to check, must be at least 2 cards</param>
        /// <returns>True if all the cards are the same suit</returns>
        /** @type {function(array):boolean} */
        var HasFlush = function(hand)
        {
            //Debug.Assert(hand.length >= 2);
            //if (hand.length >= 2)
            //{
            for (var idx = 0; idx <= hand.length - 2; idx++)
            {
                if (hand[idx].suit != hand[idx + 1].suit)
                {
                    return false;   // any bad match and return false
                }
            }
            // if we get this far, all the suits are the same
            return true;
            //}
            //return false;
        };

    }])

    // this service determines which cards to hold
    .service('handAnalyzer', ['payout', function(payout) {
        var JACK = 11;
        var QUEEN = 12;
        var KING = 13;
        var ACE = 1;

        /// <summary>
        /// This is to analyze and basic 5 card hand to determine which 5 cards to hold
        ///
        /// The following table shows the basic strategy from top to bottom priority:
        ///
        /// Type of Play	        Play Details
        /// ------------            ------------
        /// Pat Hand	            Full House; Straight Flush; Royal Flush
        /// 4 of a Kind	            2222; 3333; 4444; 5555; 6666; 7777; 8888; 9999; TTTT; JJJJ; QQQQ; KKKK...
        /// 4 to a Royal Flush	    TJQA; TJQK; TJKA; TQKA; JQKA
        /// 3 of a Kind	            222; 333; 444; 555; 666; 777; 888; 999; TTT; JJJ; QQQ; KKK; AAA
        /// Pat Hand	            Straight; Flush
        /// 2 Pair	                2233; 2244; 2255; 2266; 2277; 2288; 2299; 22TT; 22JJ; 22QQ; 22KK; 22AA...
        /// 4 to a Straight Flush	A234; A235; A245; A345; 2345; 2346; 2356; 2456; 3456; 3457; 3467; 3567...
        /// 1 High Pair	            JJ; QQ; KK; AA
        /// 3 to a Royal Flush	    TJA; TJQ; TJK; TQA; TQK; TKA; JQA; JQK; JKA; QKA
        /// 4 to a Flush	        2347; 2348; 2349; 234T; 234J; 234Q; 234K; 2357; 2358; 2359; 235T; 235J...
        /// 4 to a Straight	        TJQK
        /// 1 Low Pair	            22; 33; 44; 55; 66; 77; 88; 99; TT
        /// 4 to a Straight	        2345; 3456; 4567; 5678; 6789; 789T; 89TJ; 9TJQ
        /// 3 to a Straight Flush	345; 456; 567; 678; 789; 89T; 89J; 8TJ; 8JQ; 9TJ; 9TQ; 9JQ; 9JK; 9QK
        /// 2 to a Royal Flush	    JQ
        /// 4 to a Straight	        JQKA
        /// 2 to a Royal Flush	    JA; JK; QA; QK; KA
        /// 4 to a Straight	        9JQK; TJQA; TJKA; TQKA
        /// 3 to a Straight Flush	A23; A24; A25; A34; A35; A45; 234; 235; 245; 346; 356; 457; 467; 568...
        /// 3 high cards mixed      JQK
        /// 2 high cards mixed      JQ; QK
        /// 2 to a Royal Flush	    TJ; TQ
        /// Single Card	            a Jack; a Queen; a King; an Ace
        /// 3 to a Straight Flush	236; 246; 256; 347; 357; 367; 458; 468; 478; 569; 579; 589; 67T; 68T; 69T
        /// Garbage	                Discard everything
        ///
        /// </summary>
        /// <param name="myHand"></param>
        /// <returns>string</returns>
        /** @type {function(array):{array,string}} */
        this.Analyze = function(myHand) {
            //var isPaiGow;
            var holdCards = [];
            var vegasPayouts = {
                PaiGow: 0,
                JacksOrBetterPair: 1,
                TwoPair: 2,
                ThreeOfKind: 3,
                Straight: 4,
                Flush: 6,
                FullHouse: 9,
                FourOfKind: 25,
                StraightFlush: 50,
                RoyalFlush: 250
            };
            var hasFlush5 = false;
            var hasFlush4 = false;
            var hasStraight = false;
            var hasStraight4 = false;      // open straight
            var hasInsideStraight = false;
            var hasRoyalFlushDraw3 = false;
            //bool has3OfKind = false;
            var hasHighPair = false;
            var hasLowPair = false;
            var highCardCount = 0;
            var advice = '';
            var paigow = false;

            var hcIndex;

            var sortedHandValues = [myHand[0].value, myHand[1].value, myHand[2].value, myHand[3].value, myHand[4].value];

            // insertion sort
            var value;
            var j;
            var i;

            for (i = 1; i < 5; i++)
            {
                value = sortedHandValues[i];
                j = i - 1;
                var done = false;
                do
                {
                    if (sortedHandValues[j] > value) {
                        sortedHandValues[j + 1] = sortedHandValues[j];
                        j--;
                        if (j < 0) done = true;
                    }
                    else
                        done = true;
                } while (!done);

                sortedHandValues[j + 1] = value;
            }


            var myPayout = payout.EvaluateHand(myHand, false);
            console.log("myPayout", myPayout);
            var idx = 0;

            switch (myPayout) {
                case vegasPayouts.RoyalFlush:
                    // (10♥ J♥ Q♥ K♥ A♥)
                    holdCards = [myHand[0], myHand[1], myHand[2], myHand[3], myHand[4]];

                    advice = "JACKPOT!!! ROYAL FLUSH! HOLD ALL CARDS!";
                    return {
                        holdCards: holdCards,
                        advice: advice,
                        isPaiGow: paigow
                    };

                case vegasPayouts.StraightFlush:
                    // (8♥ 9♥ 10♥ J♥ Q♥)
                    holdCards = [myHand[0], myHand[1], myHand[2], myHand[3], myHand[4]];

                    advice = "STRAIGHT FLUSH! Hold all cards!";
                    return {
                        holdCards: holdCards,
                        advice: advice,
                        isPaiGow: paigow
                    };

                case vegasPayouts.TwoPair:
                    // (4♥ 4♣ J♦ J♣ A♥)
                    // need to figure out which 4 cards to hold
                    holdCards = [myHand[0], myHand[1], myHand[2], myHand[3]];
                    idx = 0;
                    for (var c1 = 0; c1 < myHand.length - 1; c1++)
                    {
                        for (var c2 = c1 + 1; c2 < myHand.length; c2++)
                        {
                            if (myHand[c1].value == myHand[c2].value) {
                                holdCards[idx++] = myHand[c1];
                                holdCards[idx++] = myHand[c2];
                            }
                        }
                    }

                    advice = "Keep the TWO PAIR and go for the Full House";
                    return {
                        holdCards: holdCards,
                        advice: advice,
                        isPaiGow: paigow
                    };

                case vegasPayouts.FourOfKind:
                    // need to figure out which 4 cards to hold
                    // (4♥ J♥ J♦ J♣ J♠)

                    var holdCard;

                    if (myHand[0].value == myHand[1].value)
                        holdCard = myHand[0].value;
                    else
                        holdCard = myHand[2].value;

                    holdCards = [];

                    for (i = 0;i < myHand.length;i++)
                    {
                        if (myHand[i].value == holdCard)
                            holdCards.push(myHand[i]);
                    }

                    advice = "Keep the FOUR OF A KIND, hold all cards.";
                    return {
                        holdCards: holdCards,
                        advice: advice,
                        isPaiGow: paigow
                    };

                case vegasPayouts.FullHouse:
                    // (4♥ 4♣ J♦ J♣ J♥)
                    holdCards = [myHand[0], myHand[1], myHand[2], myHand[3], myHand[4]];

                    advice = "Keep the FULL HOUSE in all scenarios";
                    return {
                        holdCards: holdCards,
                        advice: advice,
                        isPaiGow: paigow
                    };

                case vegasPayouts.Flush:
                    hasFlush5 = true;
                    break;
                case vegasPayouts.Straight:
                    hasStraight = true;
                    break;
                case vegasPayouts.ThreeOfKind:
                    // I think we hold the 3 of a kind in all scenarios
                    // (4♥ J♥ J♦ J♣ A♥)
                    holdCards = [];

                    //idx = 0;
                    for (i = 0;i < myHand.length;i++)
                    {
                        // the middle card of the sorted values is always the card we are looking for (22234, 23334, 23444)
                        if (myHand[i].value == sortedHandValues[2])
                            holdCards.push(myHand[i]);
                    }

                    //has3OfKind = true;
                    advice = "Keep the THREE OF A KIND and discard the other two cards.";
                    return {
                        holdCards: holdCards,
                        advice: advice,
                        isPaiGow: paigow
                    };
                case vegasPayouts.JacksOrBetterPair:
                    hasHighPair = true;
                    break;
            }


            if (FourCardRoyalFlush(myHand)) {
                // hold the 4 to a royal flush
                holdCards = [];
                for (i = 0;i < 5;i++)
                {
                    if (myHand[i].value >= 10)
                        holdCards.push(myHand[i]);
                    else if (myHand[i].value == ACE)
                        holdCards.push(myHand[i]);
                }

                if (hasFlush5)
                // (4♥ J♥ Q♥ K♥ A♥)
                {
                    advice = "Draw for the ROYAL FLUSH jackpot, even though you have a FLUSH";
                    return {
                        holdCards: holdCards,
                        advice: advice,
                        isPaiGow: paigow
                    }

                }
                else if (hasStraight)
                // (10♣ J♥ Q♥ K♥ A♥)
                {
                    advice = "Draw for the ROYAL FLUSH jackpot, even though you have a STRAIGHT";
                    return {
                        holdCards: holdCards,
                        advice: advice,
                        isPaiGow: paigow
                    }

                }
                else if (hasHighPair)
                // (J♣ J♥ Q♥ K♥ A♥)
                {
                    advice = "Draw for the ROYAL FLUSH jackpot, even though you have a PAIR";
                    return {
                        holdCards: holdCards,
                        advice: advice,
                        isPaiGow: paigow
                    }

                }
                else
                // (4♣ J♥ Q♥ K♥ A♥)
                {
                    advice = "Draw for the ROYAL FLUSH jackpot";
                    return {
                        holdCards: holdCards,
                        advice: advice,
                        isPaiGow: paigow
                    }

                }

            }

            if (hasStraight) {
                holdCards = [myHand[0], myHand[1], myHand[2], myHand[3], myHand[4]];

                // (4♥ 5♦ 6♣ 7♠ 8♥)
                advice = "STRAIGHT! Hold all cards and take the payout";
                return {
                    holdCards: holdCards,
                    advice: advice,
                    isPaiGow: paigow
                };
            }

            if (HasFourCardInsideStraight(sortedHandValues))
                hasInsideStraight = true;

            if (HasFourCardOpenStraight(sortedHandValues))
                hasStraight4 = true;

            if (!hasFlush5 && HasFourCardFlush(myHand))
                hasFlush4 = true;

            if (!hasHighPair && HasPair(sortedHandValues))
                hasLowPair = true;

            if (ThreeCardRoyalFlush(myHand))
                hasRoyalFlushDraw3 = true;


            for (i = 0;i < 5;i++)
            {
                if (myHand[i].value >= JACK)
                    highCardCount++;
                else if (myHand[i].value == ACE)
                    highCardCount++;
            }

            ///
            // FLUSH or STRAIGHT draws here
            //
            if (hasFlush5 && hasInsideStraight) {
                // (4♥ 5♥ 6♥ 7♥ 10♥)
                holdCards = [myHand[0], myHand[1], myHand[2], myHand[3], myHand[4]];
                advice = "Hold your FLUSH even though you are 1 card away from a STRAIGHT FLUSH.";
                return {
                    holdCards: holdCards,
                    advice: advice,
                    isPaiGow: paigow
                }

            }
            else if (hasFlush5) {
                // (2♥ 5♥ 6♥ 8♥ K♥)
                holdCards = [myHand[0], myHand[1], myHand[2], myHand[3], myHand[4]];
                advice = "Keep the FLUSH and take the payout.";
                return {
                    holdCards: holdCards,
                    advice: advice,
                    isPaiGow: paigow
                }

            }
            else if (!hasFlush5 && hasFlush4)
            {
                var goodSuit;

                if (myHand[0].suit == myHand[1].suit)
                    goodSuit = myHand[0].suit;
                else
                    goodSuit = myHand[2].suit;


                var newHand = [];

                holdCards = [];

                idx = 0;
                for (i = 0;i < 5;i++)
                {
                    if (myHand[i].suit == goodSuit) {
                        holdCards[idx] = myHand[i];      // <-- regardless of situation, we keep the 4 to a flush.
                        newHand[idx++] = myHand[i].value;
                    }
                }

                var cValue;

                for(var cvsNew = ACE; cvsNew <= KING; cvsNew++)
                {
                    if (cvsNew == holdCards[0].value) continue;
                    if (cvsNew == holdCards[1].value) continue;
                    if (cvsNew == holdCards[2].value) continue;
                    if (cvsNew == holdCards[3].value) continue;


                    newHand = [holdCards[0].value, holdCards[1].value, holdCards[2].value, holdCards[3].value, cvsNew];

                    // sort the new hand using insertion sort algorithm
                    for (i = 1;i < 5;i++)
                    {
                        cValue = newHand[i];
                        j = i - 1;
                        done = false;
                        do
                        {
                            if (newHand[j] > cValue) {
                                newHand[j + 1] = newHand[j];
                                j--;
                                if (j < 0) done = true;
                            }
                            else
                                done = true;
                        } while (!done);

                        newHand[j + 1] = cValue;
                    }

                    if (HasStraight(newHand)) {
                        if (hasHighPair || hasLowPair)
                        // (4♥ 5♥ 6♥ 7♥ 7♣)
                        {
                            advice = "Hold the four cards to a STRAIGHT FLUSH DRAW and discard the PAIR";
                            return {
                                holdCards: holdCards,
                                advice: advice,
                                isPaiGow: paigow
                            }

                        }
                        else
                        // (4♥ 5♥ 6♥ 7♥ 10♣)
                        {
                            advice = "Hold the four cards to a STRAIGHT FLUSH DRAW!";
                            return {
                                holdCards: holdCards,
                                advice: advice,
                                isPaiGow: paigow
                            }

                        }
                    }

                }

                // if we get here, no straight flush
                if (hasRoyalFlushDraw3) {

                    holdCards = [];

                    var highCards = [];
                    idx = 0;
                    // we need to know what our high cards are
                    for (i = 0; i < 5; i++)
                    {
                        if (myHand[i].value >= JACK)
                            highCards.push(myHand[i]);
                        else if (myHand[i].value == ACE)
                            highCards.push(myHand[i])
                    }

                    if (hasHighPair)  {
                        // need to find out which 2 cards are the high pair.

                        var pairValue2 = 0;
                        for (i = 0; i < 5; i++)
                        {
                            if (myHand[i].suit != goodSuit) {
                                pairValue2 = myHand[i].value;
                                break;
                            }

                        }

                        holdCards = [];
                        //idx = 0;
                        for (i = 0; i < 5; i++)
                        {
                            if (myHand[i].value == pairValue2)
                                holdCards.push(myHand[i]);
                            //holdCards[idx++] = myHand[i];
                        }

                        // (2♥ 5♥ 6♥ J♥ J♣)
                        advice = "It is the OPTIMAL WAY to play it safe and keep the HIGH PAIR, but one may be tempted to keep the FLUSH or ROYAL FLUSH DRAW.";
                        return {
                            holdCards: holdCards,
                            advice: advice,
                            isPaiGow: paigow
                        }
                    }
                    else if (highCardCount == 4) {
                        goodSuit = '';
                        if (highCards[0].suit == highCards[1].suit)  // (3♥ J♥ Q♥ K♥ A♠)
                            goodSuit = highCards[0].suit;
                        else if (highCards[2].suit == highCards[3].suit)   // (3♥ J♣ Q♥ K♥ A♥)
                            goodSuit = highCards[2].suit;

                        idx = 0;
                        for(hcIndex in highCards)
                        {
                            if(highCards.hasOwnProperty(hcIndex)) {
                                if (highCards[hcIndex].suit == goodSuit) holdCards[idx++] = highCards[hcIndex];
                            }
                            else {
                                console.log("hcIndex is not a key in highCards", hcIndex);
                            }

                        }

                        advice = "Keep the THREE TO ROYAL FLUSH draw and discard the other cards for a chance of a big payout.";
                        return {
                            holdCards: holdCards,
                            advice: advice,
                            isPaiGow: paigow
                        }


                    }
                    else if (highCardCount == 3) {
                        // we need to know which 3 is the to a royal flush
                        holdCards = [];
                        if (highCards[0].suit == highCards[1].suit && highCards[1].suit == highCards[2].suit)   // (3♥ 5♣ J♥ Q♥ K♥)
                        {
                            holdCards = [highCards[0], highCards[1], highCards[2]];
                        }
                        else {
                            // we have to go find the 10
                            for (i = 0; i < 5; i++)
                            {
                                if (myHand[i].value == 10) {
                                    holdCards.push(myHand[i]);
                                    break;
                                }
                            }

                            if (highCards[0].suit == holdCards[0].suit)  // (3♥ 10♥ Q♥ K♣ A♥)
                                holdCards.push(myHand[0]);
                            if (highCards[1].suit == holdCards[0].suit)  // (3♥ 10♥ Q♥ K♥ A♠)
                                holdCards.push(myHand[1]);
                            if (highCards[2].suit == holdCards[0].suit)  // (3♥ 10♥ Q♣ K♥ A♥)
                                holdCards.push(myHand[2]);
                        }

                    }
                    else  // high count is 2
                    {
                        // (3♥ 7♣ 10♥ Q♥ A♥)
                        // we need to find the 10
                        holdCards = [];
                        for (i = 0; i < 5; i++)
                        {
                            if (myHand[i].value >= 10)
                                holdCards.push(myHand[i]);
                            else if (myHand[i].value == ACE)
                                holdCards.push(myHand[i]);
                        }

                    }

                    advice = "Keep the THREE CARDS TO ROYAL FLUSH for a chance at big payout and discard the FLUSH draw.";
                    return {
                        holdCards: holdCards,
                        advice: advice,
                        isPaiGow: paigow
                    };

                }
                else if (hasHighPair) {
                    // need to find out which 2 cards are the high pair.

                    var pairValue = 0;
                    for (i = 0; i < 5; i++)
                    {
                        if (myHand[i].suit != goodSuit) {
                            pairValue = myHand[i].value;
                            break;
                        }

                    }

                    holdCards = [];
                    //idx = 0;
                    for (i = 0; i < 5; i++)
                    {
                        if (myHand[i].value == pairValue)
                            holdCards.push(myHand[i]);
                        //holdCards[idx++] = myHand[i];
                    }

                    // (2♥ 5♥ 6♥ J♥ J♣)
                    advice = "Play conservative and keep the HIGH PAIR and discard the FLUSH draw";
                    return {
                        holdCards: holdCards,
                        advice: advice,
                        isPaiGow: paigow
                    }
                }
                else if (hasInsideStraight)
                // (2♥ 5♥ 6♥ 7♥ 8♣)
                {
                    advice = "Keep the FLUSH DRAW because payout is higher and slightly better chance of winning versus the STRAIGHT DRAW";
                    return {
                        holdCards: holdCards,
                        advice: advice,
                        isPaiGow: paigow
                    }
                }
                else if (hasLowPair)
                // (2♥ 5♥ 6♥ 10♥ 10♣)
                {
                    advice = "FLUSH DRAW average payout is double versus keeping the LOW PAIR. Its better to take a risk in this situation.";
                    return {
                        holdCards: holdCards,
                        advice: advice,
                        isPaiGow: paigow
                    }
                }
                else if (highCardCount > 0)
                // (2♥ 5♥ 6♥ J♥ A♣)
                {
                    advice = "FLUSH DRAW average payout is 6 to 8 times better than holding the HIGH CARD in this situation. Keep the FLUSH DRAW.";
                    return {
                        holdCards: holdCards,
                        advice: advice,
                        isPaiGow: paigow
                    }
                }
                else
                // (2♣ 3♥ 5♥ 6♥ 10♥)
                {
                    advice = "FLUSH DRAW is your best chance of winning (18%)";
                    return {
                        holdCards: holdCards,
                        advice: advice,
                        isPaiGow: paigow
                    }
                }
            }

            // 3 Card Royal Flush is a better hand than a low pair
            if (hasRoyalFlushDraw3 && hasLowPair) {
                // we need to find out if the low pair is a pair of 10s, if it is, it gets tricky on how to find out what the royal flush cards are

                pairValue = 0;

                for (i = 0; i < 4; i++)
                {
                    if (sortedHandValues[i] == sortedHandValues[i + 1]) {
                        // found them!
                        pairValue = sortedHandValues[i];
                        break;
                    }
                }

                if (pairValue == 10) {
                    if (highCardCount == 2)  // this is easy (2♦-10♣-10♠-Q♠-K♠)
                    {
                        holdCards =[];
                        idx = 0;

                        for (i = 0; i < 5; i++)
                        {
                            if (myHand[i].value >= JACK)
                                holdCards.push(myHand[i]);
                            else if (myHand[i].value == ACE)
                                holdCards.push(myHand[i]);

                        }

                        for (i = 0; i < 5; i++)
                        {
                            if (myHand[i].value == 10 && myHand[i].suit == holdCards[0].suit)
                                holdCards.push(myHand[i]);
                        }


                    }
                    else if (highCardCount == 3) {
                        highCards = [];

                        // we need to know what our high cards are
                        for (i = 0; i < 5; i++)
                        {
                            if (myHand[i].value >= JACK)
                                highCards.push(myHand[i]);
                            else if (myHand[i].value == ACE)
                                highCards.push(myHand[i]);
                        }
                        holdCards = [];

                        // find the matching suits
                        if (highCards[0].suit == highCards[1].suit && highCards[1].suit == highCards[2].suit)   // all ths suits match
                        {
                            //  (10♣ 10♠ Q♥ K♥ A♥)
                            holdCards = [highCards[0], highCards[1], highCards[2]];
                            advice = "Keep the SUITED HIGH CARDS for the outside chance of getting a ROYAL FLUSH and discard the pair of TENS.";
                            return {
                                holdCards: holdCards,
                                advice: advice,
                                isPaiGow: paigow
                            }
                        }
                        else if (highCards[0].suit == highCards[1].suit) {
                            //  (10♣ 10♠ Q♠ K♠ A♥)

                            // check if the pair of tens has a matching suit
                            if (myHand[0].suit == highCards[0].suit) {
                                holdCards = [myHand[0], highCards[0], highCards[1]];
                                advice = "Keep the three cards to a ROYAL FLUSH and discard the pair of TENS.";
                            }
                            else if (myHand[1].suit == highCards[0].suit) {
                                holdCards = [myHand[1], highCards[0], highCards[1]];
                                advice = "Keep the three cards to a ROYAL FLUSH and discard the pair of TENS.";
                            }
                            else {
                                // should not be here
                                holdCards = [highCards[0], highCards[1]];
                                advice = "Keep the SUITED HIGH CARDS for the outside chance of getting a ROYAL FLUSH";
                            }

                            return {
                                holdCards: holdCards,
                                advice: advice,
                                isPaiGow: paigow
                            }

                        }
                        else if (highCards[1].suit == highCards[2].suit) {
                            //  (10♣ 10♠ Q♥ K♠ A♠)
                            // check if the pair of tens has a matching suit
                            if (myHand[0].suit == highCards[0].suit) {
                                holdCards = [myHand[0], highCards[0], highCards[1]];
                                advice = "Keep the three cards to a ROYAL FLUSH and discard the pair of TENS.";
                            }
                            else if (myHand[1].suit == highCards[0].suit) {
                                holdCards = [myHand[1], highCards[0], highCards[1]];
                                advice = "Keep the three cards to a ROYAL FLUSH and discard the pair of TENS.";
                            }
                            else {
                                // should not be here
                                holdCards = [highCards[0], highCards[1]];
                                advice = "Keep the SUITED HIGH CARDS for the outside chance of getting a ROYAL FLUSH";
                            }

                            return {
                                holdCards: holdCards,
                                advice: advice,
                                isPaiGow: paigow
                            }

                        }
                        else if (highCards[0].suit == highCards[2].suit) {
                            //  (10♣ 10♠ Q♠ K♥ A♠)
                            // check if the pair of tens has a matching suit
                            if (myHand[0].suit == highCards[0].suit) {
                                holdCards = [myHand[0], highCards[0], highCards[1]];
                                advice = "Keep the three cards to a ROYAL FLUSH and discard the pair of TENS.";
                            }
                            else if (myHand[1].suit == highCards[0].suit) {
                                holdCards = [myHand[1], highCards[0], highCards[1]];
                                advice = "Keep the three cards to a ROYAL FLUSH and discard the pair of TENS.";
                            }
                            else {
                                // should not be here
                                holdCards = [highCards[0], highCards[1]];
                                advice = "Keep the SUITED HIGH CARDS for the outside chance of getting a ROYAL FLUSH";
                            }

                            return {
                                holdCards: holdCards,
                                advice: advice,
                                isPaiGow: paigow
                            }

                        }

                    }
                }
                else {
                    // (2♣ 2♠ Q♥ K♥ A♥)
                    holdCards = [];
                    idx = 0;
                    for (i = 0; i < 5; i++)
                    {
                        if (myHand[i].value >= 10)
                            holdCards.push(myHand[i]);
                        else if (myHand[i].value == ACE)
                            holdCards.push(myHand[i]);

                        if (idx == 3) break;
                    }
                }
                advice = "Keep the THREE TO ROYAL FLUSH draw and discard the LOW PAIR.";
                return {
                    holdCards: holdCards,
                    advice: advice,
                    isPaiGow: paigow
                }

            }

            // if got a PAIR we want to hold it if we get this far in the code
            if (hasLowPair || hasHighPair) {

                pairValue = 0;

                for (i = 0; i < 5; i++) {
                    if (sortedHandValues[i] == sortedHandValues[i + 1]) {
                        // found them!
                        pairValue = sortedHandValues[i];
                        break;
                    }
                }

                holdCards = [];
                idx = 0;
                for (i = 0; i < 5; i++) {
                    if (myHand[i].value == pairValue)
                        holdCards.push(myHand[i]);
                }

                if (hasHighPair && hasRoyalFlushDraw3)  // (2♣ Q♣ Q♥ K♥ A♥)
                {
                    advice = "Keep the HIGH PAIR with guarantee of payout and discard the THREE CARD ROYAL FLUSH draw";
                    return {
                        holdCards: holdCards,
                        advice: advice,
                        isPaiGow: paigow
                    }

                }
                else if (hasInsideStraight && hasHighPair)  // (9♣ 10♣ J♥ Q♥ Q♠)
                {
                    advice = "Keep the HIGH PAIR with guarantee of payout and discard the STRAIGHT DRAW";
                    return {
                        holdCards: holdCards,
                        advice: advice,
                        isPaiGow: paigow
                    }

                }
                else if (hasHighPair)  // (2♣ 4♣ 8♥ K♥ K♦)
                {
                    advice = "Keep the HIGH PAIR with guarantee of payout and discard all other cards";
                    return {
                        holdCards: holdCards,
                        advice: advice,
                        isPaiGow: paigow
                    }

                }
                else if (highCardCount == 1) {
                    var sHighCard = '';

                    if (sortedHandValues[0] == ACE)    // (4♣ 4♦ 8♥ 9♥ A♦)
                        sHighCard = "ACE";
                    else if (sortedHandValues[4] == KING)  // (4♣ 4♦ 8♥ 9♥ K♦)
                        sHighCard = "KING";
                    else if (sortedHandValues[4] == JACK)  // (4♣ 4♦ 8♥ 9♥ J♦)
                        sHighCard = "JACK";
                    else if (sortedHandValues[4] == QUEEN)  // (4♣ 4♦ 8♥ 9♥ Q♦)
                        sHighCard = "QUEEN";

                    advice = "Keep the LOW PAIR instead of keeping the " + sHighCard + ". The Average Win is double for the LOW PAIR over the " + sHighCard;
                    return {
                        holdCards: holdCards,
                        advice: advice,
                        isPaiGow: paigow
                    }

                }
                else if (highCardCount > 0)  // (4♣ 4♦ 8♥ J♥ A♦) {
                {
                    advice = "Keep the LOW PAIR because of the higher Average Win payout instead of keeping the HIGH CARDS";
                    return {
                        holdCards: holdCards,
                        advice: advice,
                        isPaiGow: paigow
                    }

                }
                else if (hasInsideStraight)  // (4♣ 4♦ 5♥ 6♥ 7♦)
                {
                    advice = "Keep the LOW PAIR and discard STRAIGHT DRAW";
                    return {
                        holdCards: holdCards,
                        advice: advice,
                        isPaiGow: paigow
                    }

                }
                else  // (4♣ 4♦ 5♥ 7♥ 10♦)
                {
                    advice = "Your best hand is to keep the LOW PAIR";
                    return {
                        holdCards: holdCards,
                        advice: advice,
                        isPaiGow: paigow
                    }

                }
            }

            if (!hasRoyalFlushDraw3 && hasStraight4) {
                holdCards = [];

                // now we got to figure out which 4 cards to hold
                if (highCardCount == 4) // (4♣ J♦ Q♥ K♥ A♦)
                {
                    // hold all high cards if we have 4 of them
                    for (i = 0; i < 5; i++)
                    {
                        if (myHand[i].value >= 10)
                            holdCards.push(myHand[i]);
                        else if (myHand[i].value == ACE)
                            holdCards.push(myHand[i]);
                    }

                    advice = "Hold all HIGH CARDS because any card higher than a 10 and you win!";
                    return {
                        holdCards: holdCards,
                        advice: advice,
                        isPaiGow: paigow
                    }

                }

                var badValue;
                // the discarded card is either the first or last card in the sorted hand
                if (sortedHandValues[0] + 3 == sortedHandValues[3])  // (4♣ 5♦ 6♥ 7♥ 10♦)
                {
                    //keep first 4
                    badValue = sortedHandValues[4];
                    for (i = 0; i < 5; i++)
                    {
                        if (myHand[i].value != badValue)
                            holdCards.push(myHand[i]);
                    }
                }
                else if (sortedHandValues[1] + 3 == sortedHandValues[4])  // (2♣ 6♦ 7♥ 8♥ 9♦)
                {
                    // keep last 4
                    badValue = sortedHandValues[0];
                    for (i = 0; i < 5; i++)
                    {
                        if (myHand[i].value != badValue)
                            holdCards.push(myHand[i]);
                    }
                }
                else {
                    advice = "Something is wrong, we could not determine where the straight was";
                    return {
                        holdCards: holdCards,
                        advice: advice,
                        isPaiGow: paigow
                    }
                }


                advice = "Keep the outside STRAIGHT DRAW for best average payout.";
                return {
                    holdCards: holdCards,
                    advice: advice,
                    isPaiGow: paigow
                }
            }

            // 3 card straight flush is better than holding mixed high cards
            if (!hasRoyalFlushDraw3 && Has3CardStraightFlush(myHand)) {
                var straightHand = [];
                if (sortedHandValues[0] + 1 == sortedHandValues[1] && sortedHandValues[1] + 1 == sortedHandValues[2]) // (4♣ 5♣ 6♣ 9♥ 10♦)
                {
                    straightHand = [sortedHandValues[0], sortedHandValues[1], sortedHandValues[2]];
                }
                else if (sortedHandValues[1] + 1 == sortedHandValues[2] && sortedHandValues[2] + 1 == sortedHandValues[3])  // (2♣ 5♥ 6♥ 7♥ 10♦)
                {
                    straightHand = [sortedHandValues[1], sortedHandValues[2], sortedHandValues[3]];
                }
                else if (sortedHandValues[2] + 1 == sortedHandValues[3] && sortedHandValues[3] + 1 == sortedHandValues[4])  // (4♣ 5♥ 8♦ 9♦ 10♦)
                {
                    straightHand = [sortedHandValues[2], sortedHandValues[3], sortedHandValues[4]];
                }

                // set the hold cards to the 3 card straight flush
                holdCards = [];
                for (i = 0; i < 5; i++)
                {
                    if (myHand[i].value == straightHand[0])
                        holdCards.push(myHand[i]);
                    if (myHand[i].value == straightHand[1])
                        holdCards.push(myHand[i]);
                    if (myHand[i].value == straightHand[2])
                        holdCards.push(myHand[i]);
                }


                // NOTE: if we had 3 or 4 high cards and a 3 to a straight flush, then the hasRoyalFlushDraw3 flag would of been set
                if (highCardCount == 1 && straightHand[2] != JACK)  // (4♣ 8♥ 9♥ 10♥ K♠)
                {
                    advice = "With a low percentage of winning, go with the hand with the highest average win. THREE CARD STRAIGHT FLUSH (no gaps) is a better hold hand than a HIGH CARD.";
                    return {
                        holdCards: holdCards,
                        advice: advice,
                        isPaiGow: paigow
                    }
                }
                else if (highCardCount == 2)   // (3♥ 4♥ 5♥ J♦ K♠)
                {
                    // the only
                    if (straightHand[2] < JACK) {
                        highCards = [];
                        // we need to know what our high cards are and check to see if they are the same suit
                        for (i = 0; i < 5; i++)
                        {
                            if (myHand[i].value >= JACK)
                                highCards.push(myHand[i]);
                            else if (myHand[i].value == ACE)
                                highCards.push(myHand[i]);
                        }

                        if (highCards[0].suit == highCards[1].suit)   // (3♥ 4♥ 5♥ J♠ K♠)
                        {
                            // this appears to be wrong
                            //holdCards[0] = highCards[1];
                            //holdCards[1] = highCards[2];

                            holdCards = [highCards[0], highCards[1]];

                            advice = "Keep the SUITED HIGH CARDS and discard the lower THREE CARD STRAIGHT FLUSH (no gaps).";
                            return {
                                holdCards: holdCards,
                                advice: advice,
                                isPaiGow: paigow
                            }

                        }
                    }
                    advice = "THREE CARD STRAIGHT FLUSH (no gaps) is a better hold hand than the HIGH CARDS.";
                    return {
                        holdCards: holdCards,
                        advice: advice,
                        isPaiGow: paigow
                    }
                }
                else
                // (3♥ 4♥ 5♥ 8♦ 9♠)
                {
                    advice = "THREE CARD STRAIGHT FLUSH (no gaps) is the best hold hand";
                    return {
                        holdCards: holdCards,
                        advice: advice,
                        isPaiGow: paigow
                    }
                }


            }

            if (highCardCount > 0) {

                highCards = [];
                // we need to know what our high cards are
                for (i = 0; i < 5; i++)
                {
                    if (myHand[i].value >= JACK)
                        highCards.push(myHand[i]);
                    else if (myHand[i].value == ACE)
                        highCards.push(myHand[i]);
                }

                if (highCardCount == 4) {
                    if (hasRoyalFlushDraw3) {
                        holdCards = new [];

                        goodSuit = '';
                        if (highCards[0].suit == highCards[1].suit)  // (3♣ J♥ Q♥ K♥ A♠)
                            goodSuit = highCards[0].suit;
                        else if (highCards[2].suit == highCards[3].suit)   // (3♣ J♣ Q♥ K♥ A♥)
                            goodSuit = highCards[2].suit;

                        idx = 0;
                        for(hcIndex in highCards)
                        {
                            if (highCards.hasOwnProperty(hcIndex)) {
                                if (highCards[hcIndex].suit == goodSuit) holdCards[idx++] = highCards[hcIndex];
                            }
                            else {
                                console.log('hcIndex is not a property of highcards', hcIndex);
                            }

                        }

                        advice = "Keep the THREE TO ROYAL FLUSH draw and discard the other cards for a chance of a big payout.";
                        return {
                            holdCards: holdCards,
                            advice: advice,
                            isPaiGow: paigow
                        }
                    }
                    else  // (3♥ J♥ Q♥ K♦ A♠)
                    {
                        // in this situation hold all high cards
                        holdCards = [highCards[0], highCards[1], highCards[2], highCards[3]];

                        advice = "Hold all HIGH CARDS because any card higher than a 10 and you win!";
                        return {
                            holdCards: holdCards,
                            advice: advice,
                            isPaiGow: paigow
                        }
                    }
                }

                if (highCardCount == 3) {
                    // check to see which high cards to hold.
                    // if any of the two cards match suit, we keep them
                    // otherwise

                    if (hasRoyalFlushDraw3) {
                        // we need to know which 3 is the to a royal flush
                        holdCards = [];
                        if (highCards[0].suit == highCards[1].suit && highCards[1].suit == highCards[2].suit)   // (3♦ 5♣ J♥ Q♥ K♥)
                        {
                            holdCards = [highCards[0], highCards[1], highCards[2]];
                        }
                        else {
                            // we have to go find the 10
                            idx = 0;
                            for (i = 0; i < 5; i++)
                            {
                                if (myHand[i].value == 10) {
                                    holdCards.push(myHand[i]);
                                    break;
                                }
                            }

                            if (highCards[0].suit == holdCards[0].suit)  // (3♣ 10♥ Q♥ K♣ A♥)
                                holdCards.push(highCards[0]);
                            if (highCards[1].suit == holdCards[0].suit)  // (3♣ 10♥ Q♥ K♥ A♠)
                                holdCards.push(highCards[1]);
                            if (highCards[2].suit == holdCards[0].suit)  // (3♣ 10♥ Q♣ K♥ A♥)
                                holdCards.push(highCards[2]);
                        }

                        advice = "Keep the THREE CARDS TO ROYAL FLUSH for a chance at a big payout.";
                        return {
                            holdCards: holdCards,
                            advice: advice,
                            isPaiGow: paigow
                        }

                    }

                    holdCards = [];
                    if (highCards[0].suit == highCards[1].suit)  // (3♦ 5♣ J♥ Q♥ A♠)
                    {
                        holdCards = [highCards[0], highCards[1]];
                        advice = "Keep the SUITED HIGH CARDS for the outside chance of getting a ROYAL FLUSH";
                        return {
                            holdCards: holdCards,
                            advice: advice,
                            isPaiGow: paigow
                        }

                    }
                    else if (highCards[1].suit == highCards[2].suit)  // (3♦ 5♣ J♣ Q♥ A♥)
                    {
                        holdCards = [highCards[1], highCards[2]];
                        advice = "Keep the SUITED HIGH CARDS for the outside chance of getting a ROYAL FLUSH";
                        return {
                            holdCards: holdCards,
                            advice: advice,
                            isPaiGow: paigow
                        }

                    }
                    else if (highCards[0].suit == highCards[2].suit)  // (3♦ 5♣ J♥ Q♣ A♥)
                    {
                        holdCards = [highCards[0], highCards[2]];
                        advice = "Keep the SUITED HIGH CARDS for the outside chance of getting a ROYAL FLUSH";
                        return {
                            holdCards: holdCards,
                            advice: advice,
                            isPaiGow: paigow
                        }
                    }
                    else {
                        idx = 0;
                        // we want the two lowest cards
                        if (highCards[0].value == JACK) {
                            holdCards.push(highCards[0]);
                            idx++;
                        }

                        if (highCards[1].value == JACK) {
                            holdCards.push(highCards[1]);
                            idx++;
                        }

                        if (highCards[2].value == JACK) {
                            holdCards.push(highCards[2]);
                            idx++;
                        }


                        if (highCards[0].value == QUEEN) {
                            holdCards.push(highCards[0]);
                            idx++;
                        }

                        if (highCards[1].value == QUEEN) {
                            holdCards.push(highCards[1]);
                            idx++;
                        }

                        if (highCards[2].value == QUEEN) {
                            holdCards.push(highCards[2]);
                            idx++;
                        }


                        if (idx == 2)  // ready to exit  (3♦ 5♣ J♥ Q♦ A♠)
                        {
                            advice = "Perfect play is to keep the two lowest HIGH CARDS even though odds do not decrease holding the 3rd HIGH CARD.";

                            return {
                                holdCards: holdCards,
                                advice: advice,
                                isPaiGow: paigow
                            }
                        }


                        if (highCards[0].value == KING) {
                            holdCards.push(highCards[0]);
                            idx++;
                        }

                        if (highCards[1].value == KING) {
                            holdCards.push(highCards[1]);
                            idx++;
                        }

                        if (highCards[2].value == KING) {
                            holdCards.push(highCards[2]);
                            idx++;
                        }


                        if (idx == 2) {  // ready to exit   (3♦ 5♣ Q♥ K♦ A♠)
                            advice = "Keep the two lowest HIGH CARDS and discard the ACE";

                            return {
                                holdCards: holdCards,
                                advice: advice,
                                isPaiGow: paigow
                            }
                        }
                    }
                }
                else if (highCardCount == 2) {

                    if (hasRoyalFlushDraw3)  // (3♦ 5♣ 10♥ Q♥ A♥)
                    {
                        // we need to find the 10
                        holdCards = [];
                        for (i = 0; i < 5; i++)
                        {
                            if (myHand[i].value >= 10)
                                holdCards.push(myHand[i]);
                            else if (myHand[i].value == ACE)
                                holdCards.push(myHand[i]);
                        }

                        advice = "Keep the THREE TO ROYAL FLUSH draw and discard the other cards for a chance of a big payout.";
                        return {
                            holdCards: holdCards,
                            advice: advice,
                            isPaiGow: paigow
                        }
                    }
                    else if (hasStraight4) {
                        holdCards = [];

                        var badValue2;
                        // the discarded card is either the first or last card in the sorted hand
                        if (sortedHandValues[0] + 3 == sortedHandValues[3])  // (4♣ 5♦ 6♥ 7♥ 10♦)
                        {
                            //keep first 4
                            badValue2 = sortedHandValues[4];
                            for (i = 0; i < 5; i++)
                            {
                                if (myHand[i].value != badValue2)
                                    holdCards.push(myHand[i]);
                            }
                        }
                        else if (sortedHandValues[1] + 3 == sortedHandValues[4])  // (2♣ 6♦ 7♥ 8♥ 9♦)
                        {
                            // keep last 4
                            badValue2 = sortedHandValues[0];
                            for (i = 0; i < 5; i++)
                            {
                                if (myHand[i].value != badValue2)
                                    holdCards.push(myHand[i]);
                            }
                        }
                        else {
                            advice = "Something is wrong, we could not determine where the straight was";
                            return {
                                holdCards: holdCards,
                                advice: advice,
                                isPaiGow: paigow
                            }
                        }

                        advice = "Keep the outside STRAIGHT DRAW for best average payout instead of holding onto the HIGH CARDS.";
                        return {
                            holdCards: holdCards,
                            advice: advice,
                            isPaiGow: paigow
                        }
                    }
                    else   // (3♦ 5♣ 6♥ Q♦ A♠)
                    {
                        holdCards = [highCards[0], highCards[1]];

                        advice = "Hold on to your HIGH CARDS for best chance of a payout";
                        return {
                            holdCards: holdCards,
                            advice: advice,
                            isPaiGow: paigow
                        }
                    }
                }
                else // only 1 high card
                {

                    // see if there is a 10 of the same suit
                    for (i = 0; i < 5; i++)
                    {
                        if (myHand[i].value == 10 && highCards[0].suit == myHand[i].suit) {
                            holdCards= [myHand[i], highCards[0]];

                            // (3♦ 5♣ 6♥ 10♠ K♠)
                            advice = "Hold the HIGH CARD with the 10 of the same suit for outside chance of ROYAL FLUSH";
                            return {
                                holdCards: holdCards,
                                advice: advice,
                                isPaiGow: paigow
                            }

                        }
                    }

                    holdCards = [highCards[0]];

                    if (hasInsideStraight)
                    // (3♦ 4♣ 5♥ 6♠ K♠)
                        advice = "Keep the HIGH CARD because there is only a 8% chance of getting the STRAIGHT DRAW.";
                    else
                    // (3♦ 5♣ 6♥ 7♠ K♠)
                        advice = "Hold on to your only HIGH CARD, its better than discarding all 5 cards.";

                    return {
                        holdCards: holdCards,
                        advice: advice,
                        isPaiGow: paigow
                    }
                }

            }


            // if we get all the way here, they need to discard all 5 cards
            //isPaiGow = true;

            holdCards =[];

            if (hasInsideStraight)  {
                // (3♦ 4♣ 6♥ 7♠ 10♠)
                advice = "Discard all cards. An INSIDE STRAIGHT DRAW is only a 8.5% chance of success.";
            }
            else {
                // (2♦ 4♣ 6♥ 8♠ 10♠)
                advice = "Nothing in the hand is worth keeping, draw 5 new cards!";
                paigow = true;
            }

            return {
                holdCards: holdCards,
                advice: advice,
                isPaiGow: paigow
            }

        };


        /// <summary>
        /// check for special scenario where they have 4 cards to a royal flush
        /// </summary>
        /// <param name="hand">Current hand dealt that we are checking</param>
        /// <param name="cvs">The sorted card values </param>
        /// <returns></returns>
        /** @type {function(array):boolean} */
        var FourCardRoyalFlush = function(hand)
        {
            var has4Flush = false;
            var goodSuit;
            var sortedSuits = [hand[0].suit, hand[1].suit, hand[2].suit, hand[3].suit, hand[4].suit];

            // insertion sort
            var value;
            var j;
            for (var i = 1; i < 5; i++)
            {
                value = sortedSuits[i];
                j = i - 1;
                var done = false;
                do
                {
                    if (sortedSuits[j] > value)
                    {
                        sortedSuits[j + 1] = sortedSuits[j];
                        j--;
                        if (j < 0) done = true;
                    }
                    else
                        done = true;
                } while (!done);

                sortedSuits[j + 1] = value;
            }


            // only 2 scenarios if we have 4 cards the same suit
            if (sortedSuits[1] == sortedSuits[2] && sortedSuits[1] == sortedSuits[3] && sortedSuits[1] == sortedSuits[4])
            {
                // 34444 (match last 4)
                has4Flush = true;
            }
            else if (sortedSuits[0] == sortedSuits[1] && sortedSuits[0] == sortedSuits[2] && sortedSuits[0] == sortedSuits[3])
            {
                // 44445 (match first 4)
                has4Flush = true;
            }

            // now check to see if 4 of the cards of the good suit are below a 10, if they are, return false
            if (has4Flush)
            {
                goodSuit = sortedSuits[2];  // middle one is always matching suit
                if (hand[0].suit == goodSuit && hand[0].value < 10 && hand[0].value != ACE)
                    return false;
                if (hand[1].suit == goodSuit && hand[1].value < 10 && hand[1].value != ACE)
                    return false;
                if (hand[2].suit == goodSuit && hand[2].value < 10 && hand[2].value != ACE)
                    return false;
                if (hand[3].suit == goodSuit && hand[3].value < 10 && hand[3].value != ACE)
                    return false;
                if (hand[4].suit == goodSuit && hand[4].value < 10 && hand[4].value != ACE)
                    return false;

                // if we get here, we have 4 cards to a royal flush
                return true;
            }
            else
                return false;
        };

        /// <summary>
        /// This checks to see if we have a 3 cards to a royal flush
        /// </summary>
        /// <param name="hand"></param>
        /// <param name="cvs"></param>
        /// <returns></returns>
        /** @type {function(array):boolean} */
        var ThreeCardRoyalFlush = function(hand)
        {
            var has3Flush = false;
            var goodSuit;
            var sortedSuits = [hand[0].suit, hand[1].suit, hand[2].suit, hand[3].suit, hand[4].suit];

            // insertion sort
            var value;
            var j;
            var i;
            for (i = 1; i < 5; i++)
            {
                value = sortedSuits[i];
                j = i - 1;
                var done = false;
                do
                {
                    if (sortedSuits[j] > value)
                    {
                        sortedSuits[j + 1] = sortedSuits[j];
                        j--;
                        if (j < 0) done = true;
                    }
                    else
                        done = true;
                } while (!done);

                sortedSuits[j + 1] = value;
            }


            // only 3 scenarios if we have 3 cards the same suit
            if (sortedSuits[2] == sortedSuits[3] && sortedSuits[2] == sortedSuits[4])
            {
                // 33444 (match last 3)
                has3Flush = true;
            }
            else if (sortedSuits[0] == sortedSuits[1] && sortedSuits[0] == sortedSuits[2])
            {
                // 44455 (match first 3)
                has3Flush = true;
            }
            else if (sortedSuits[1] == sortedSuits[2] && sortedSuits[1] == sortedSuits[3])
            {
                // 34445 (match middle 3)
                has3Flush = true;
            }

            // now check to see if 4 of the cards of the good suit are below a 10, if they are, return false
            if (has3Flush)
            {
                goodSuit = sortedSuits[2];  // middle one is always matching suit
                var numCount = 0;

                for (i = 0; i < 5; i++) {
                    if (hand[i].suit == goodSuit) {
                        if (hand[i].value >= 10 || hand[i].value == ACE) {
                            numCount++;
                        }
                    }
                }

                return (numCount >= 3);

                /*  this code would fail in the scenario if we had 4 cards to a flush and 3 to a royal flush.
                 if (hand[0].suit == goodSuit && hand[0].value < 10 && hand[0].value != ACE)
                 return false;
                 if (hand[1].suit == goodSuit && hand[1].value < 10 && hand[1].value != ACE)
                 return false;
                 if (hand[2].suit == goodSuit && hand[2].value < 10 && hand[2].value != ACE)
                 return false;
                 if (hand[3].suit == goodSuit && hand[3].value < 10 && hand[3].value != ACE)
                 return false;
                 if (hand[4].suit == goodSuit && hand[4].value < 10 && hand[4].value != ACE)
                 return false;

                 // if we get here, we have 3 cards to a royal flush
                 return true;
                 */
            }
            else
                return false;
        };


        /// <summary>
        /// This checks if the cards passed in are the same suit
        /// </summary>
        /// <param name="hand">The hand to check, must be at least 2 cards</param>
        /// <returns>True if all the cards are the same suit</returns>
        /** @type {function(array):boolean} */
        var HasFlush = function(hand)
        {
            for (var idx = 0; idx <= 5 - 2; idx++)
            {
                if (hand[idx].suit != hand[idx + 1].suit)
                {
                    return false;   // any bad match and return false
                }
            }
            // if we get this far, all the suits are the same
            return true;
            //}
            //return false;
        };

        /// <summary>
        ///  This checks to see if we have a 4 card flush going
        /// </summary>
        /// <param name="hand"></param>
        /// <returns></returns>
        /** @type {function(array):boolean} */
        var HasFourCardFlush = function(hand)
        {
            // first see if 5 of the cards are the same suit
            if (HasFlush(hand))
            {
                return true;
            }
            else
            {
                var sorted_suits = [hand[0].suit, hand[1].suit, hand[2].suit, hand[3].suit, hand[4].suit];  //  too slow -> { hand[0].suit, hand[1].suit, hand[2].suit, hand[3].suit, hand[4].suit };

                // insertion sort
                var value;
                var j;
                for (var i = 1; i < 5; i++)
                {
                    value = sorted_suits[i];
                    j = i - 1;
                    var done = false;
                    do
                    {
                        if (sorted_suits[j] > value)
                        {
                            sorted_suits[j + 1] = sorted_suits[j];
                            j--;
                            if (j < 0) done = true;
                        }
                        else
                            done = true;
                    } while (!done);

                    sorted_suits[j + 1] = value;
                }
                // only 2 scenarios if we have 4 cards the same suit
                if (sorted_suits[1] == sorted_suits[2] && sorted_suits[1] == sorted_suits[3] && sorted_suits[1] == sorted_suits[4])
                {
                    // 34444 (match last 4)
                    return true;
                }
                else if (sorted_suits[0] == sorted_suits[1] && sorted_suits[0] == sorted_suits[2] && sorted_suits[0] == sorted_suits[3])
                {
                    // 44445 (match first 4)
                    return true;
                }
            }

            return false;
        };

        /// <summary>
        /// This checks for a 4 card straight with no gaps(ie. 2-3-4-5 or J-Q-K-A)
        /// </summary>
        /// <param name="cvs"></param>
        /// <returns></returns>
        /** @type {function(array):boolean} */
        var HasFourCardOpenStraight = function(cvs)
        {
            var iHandCount = cvs.length;
            var newHand = [];

            for (var c1 = 0; c1 <= iHandCount - 4; c1++)
            {
                for (var c2 = c1 + 1; c2 <= iHandCount - 3; c2++)
                {
                    for (var c3 = c2 + 1; c3 <= iHandCount - 2; c3++)
                    {
                        for (var c4 = c3 + 1; c4 <= iHandCount - 1; c4++)
                        {
                            newHand = [cvs[c1], cvs[c2], cvs[c3], cvs[c4]];

                            // check here if we have a 4 card straight

                            if (newHand[0] + 1 == newHand[1] && newHand[1] + 1 == newHand[2] && newHand[2] + 1 == newHand[3])
                            {
                                return true;
                            }
                            else if (newHand[0] == ACE)
                            {
                                // we need to check for ace high straight
                                if (newHand[1] == JACK && newHand[2] == QUEEN && newHand[3] == KING)
                                {
                                    return true;
                                }
                            }
                        }
                    }
                }
            }

            // if we get here, there is no 4 card straight
            return false;
        };

        /// <summary>
        ///  This determines if we have a 4 cards to a straight with any gap in between: 2-3-4-6 10-Q-K-A
        /// </summary>
        /// <param name="cvs">sorted card values</param>
        /// <returns>true if we have 4 cards to a straight</returns>
        /** @type {function(array):boolean} */
        var HasFourCardInsideStraight = function(cvs)
        {

            // first check if the first 4 cards or the last 4 cards are straight
            if (cvs[0] + 1 == cvs[1] && cvs[1] + 1 == cvs[2] && cvs[2] + 1 == cvs[3])
            {
                return true;
            }
            else if (cvs[1] + 1 == cvs[2] && cvs[2] + 1 == cvs[3] && cvs[3] + 1 == cvs[4])
            {
                return true;
            }
            else
            {
                // this routine will treat one card as a wild card and see if have a straight.
                var newHand = [cvs[0], cvs[1], cvs[2], cvs[3], cvs[4]];

                /*
                 var cValues = { ACE, CardValues.Two, CardValues.Three,
                 CardValues.Four, CardValues.Five, CardValues.Six,
                 CardValues.Seven, CardValues.Eight, CardValues.Nine,
                 CardValues.Ten, JACK, QUEEN, KING };
                 */

                for (var pos = 0; pos <= 4; pos++)
                {
                    for (var cvsNew = 1; cvsNew <= 13; cvsNew++)
                    {
                        newHand = [cvs[0], cvs[1], cvs[2], cvs[3], cvs[4]];
                        newHand[pos] = cvsNew;

                        // sort the new hand using insertion sort algorithm
                        var value;
                        var j;
                        for (var i = 1; i < 5; i++)
                        {
                            value = newHand[i];
                            j = i - 1;
                            var done = false;
                            do
                            {
                                if (newHand[j] > value)
                                {
                                    newHand[j + 1] = newHand[j];
                                    j--;
                                    if (j < 0) done = true;
                                }
                                else
                                    done = true;
                            } while (!done);

                            newHand[j + 1] = value;
                        }

                        if (HasStraight(newHand))
                            return true;
                    }
                }

                // if we get here, then no 4 card straight
                return false;

            }

        };

        /** @type {function(array):boolean} */
        var HasPair = function(sorted_hand)
        {

            for (var idx = 0; idx <= sorted_hand.length - 2; idx++)
            {
                // check for pair
                if (sorted_hand[idx] == sorted_hand[idx + 1])
                {
                    return true;
                }
            }
            //}

            return false;
        };

        /// <summary>
        /// See if the cards are a straight
        /// </summary>
        /// <param name="cvs">Card values in numeric order</param>
        /// <remarks>The values must be presorted before calling this function</remarks>
        /// <returns>True if straight found</returns>
        /** @type {function(array):boolean} */
        var HasStraight = function(cvs)
        {
            // if you have a pair, then you dont have a straight
            if (HasPair(cvs))
                return false;

            //if (cvs.Length == 5)
            //{
            if (cvs[0] + 1 == cvs[1] && cvs[1] + 1 == cvs[2] && cvs[2] + 1 == cvs[3] && cvs[3] + 1 == cvs[4])
            {
                return true;
            }
            else if (cvs[0] == 1)
            {
                // we need to check for ace high straight
                if (cvs[1] == 10 && cvs[2] == JACK && cvs[3] == QUEEN && cvs[4] == KING)
                {
                    return true;
                }
            }
            //}
            return false;
        };


        /// <summary>
        /// We are checking if we have a 3 card straight flush.
        ///
        /// This should not be called if we have a pair because the code will not work
        /// </summary>
        /// <param name="hand"></param>
        /// <param name="cvs"></param>
        /// <returns></returns>
        /** @type {function(array):boolean} */
        var Has3CardStraightFlush = function(hand)
        {

            var tempHand = [hand[0],hand[1],hand[2],hand[3],hand[4]];

            // sort the hand vy value
            var swapCard;
            var j;
            for (var i = 1; i < 5; i++)
            {
                swapCard = tempHand[i];
                j = i - 1;
                var done = false;
                do
                {
                    if (tempHand[j].value > swapCard.value)
                    {
                        tempHand[j + 1] = tempHand[j];
                        j--;
                        if (j < 0) done = true;
                    }
                    else
                        done = true;
                } while (!done);

                tempHand[j + 1] = swapCard;
            }


            if (tempHand[0].value + 1 == tempHand[1].value && tempHand[1].value + 1 == tempHand[2].value)
            {
                if (tempHand[0].suit == tempHand[1].suit && tempHand[1].suit == tempHand[2].suit) return true;
            }

            if (tempHand[1].value + 1 == tempHand[2].value && tempHand[2].value + 1 == tempHand[3].value)
            {
                if (tempHand[1].suit == tempHand[2].suit && tempHand[2].suit == tempHand[3].suit) return true;
            }

            if (tempHand[2].value + 1 == tempHand[3].value && tempHand[3].value + 1 == tempHand[4].value)
            {
                if (tempHand[2].suit == tempHand[3].suit && tempHand[3].suit == tempHand[4].suit) return true;
            }

            return false;
        };

    }])

    // this service calculates all possible percentages of a winning hand
    .service('calculate', ['payout', function(payout) {
        this.CalculatePokerOdds = function(currentDeck, currentHand)
        {
            var optimalHoldCards = DrawFourofNothing(currentDeck, currentHand);

            var d3 = DrawThreeCards(currentDeck, currentHand);

            for (var x3 in d3) {
                optimalHoldCards.push(d3[x3]);
            }

            var d2 = DrawTwoCards(currentDeck, currentHand);
            for (var x2 in d2) {
                optimalHoldCards.push(d2[x2]);
            }

            var d1 = DrawOneCard(currentDeck, currentHand);
            for (var x1 in d1) {
                optimalHoldCards.push(d1[x1]);
            }

            //console.log("optimalHoldCards", optimalHoldCards);
            return optimalHoldCards;
        };

        var DrawOneCard = function(currentDeck, currentHand) {

            var possible_hand = [currentHand[0], currentHand[1], currentHand[2], currentHand[3], currentHand[4]];
            var myStats = [];

            var iDeckCount = currentDeck.length;
            var iHandCount = currentHand.length;
            var payback;

            var max_hands = iDeckCount - 5;
            var win_count = 0;
            var win_amount = 0;

            for (var c1 = 0; c1 <= iHandCount - 4; c1++)
            {
                for (var c2 = c1 + 1; c2 <= iHandCount - 3; c2++)
                {
                    for (var c3 = c2 + 1; c3 <= iHandCount - 2; c3++)
                    {
                        for (var c4 = c3 + 1; c4 <= iHandCount - 1; c4++)
                        {
                            possible_hand[0] = currentHand[c1];
                            possible_hand[1] = currentHand[c2];
                            possible_hand[2] = currentHand[c3];
                            possible_hand[3] = currentHand[c4];

                            win_count = 0;
                            win_amount = 0;
                            for (var d1 = 5; d1 <= iDeckCount - 1; d1++)
                            {
                                possible_hand[4] = currentDeck[d1];

                                payback = payout.EvaluateHand(possible_hand, false);
                                if (payback != 0)   // payout.VegasPayoutHands.PaiGow)
                                {
                                    win_count += 1;
                                    win_amount += payback;
                                }
                            }

                            if (win_count > 0)
                            {
                                var myStat = {
                                    hold_cards: [possible_hand[0], possible_hand[1], possible_hand[2], possible_hand[3]],
                                    win_count: win_count,
                                    win_average: win_count / max_hands,
                                    win_amount_avg: win_amount / win_count
                                };
                                myStats.push(myStat);
                            }
                            else
                            {
                                var myStat2 = {
                                    hold_cards: [possible_hand[0], possible_hand[1], possible_hand[2], possible_hand[3]],
                                    win_count: 0,
                                    win_average: 0,
                                    win_amount_avg: 0
                                };
                                myStats.push(myStat2);
                            }
                        }
                    }
                }
            }

            return myStats;
        };

        var DrawTwoCards = function(currentDeck, currentHand)
        {
            console.log("In DrawTwoCards...");
            var possible_hand = [currentHand[0], currentHand[1], currentHand[2], currentHand[3], currentHand[4]];
            var myStats = [];

            var iDeckCount = currentDeck.length;
            var iHandCount = currentHand.length;
            //Cards.VegasPayoutHands payback;
            var payback;
            var win_count = 0;
            var win_amount = 0;

            var max_hands = ((iDeckCount - 5) * (iDeckCount - 6)) / 2;
            //bool hasPair;

            for (var c1 = 0; c1 <= iHandCount - 3; c1++)
            {
                for (var c2 = c1 + 1; c2 <= iHandCount - 2; c2++)
                {
                    for (var c3 = c2 + 1; c3 <= iHandCount - 1; c3++)
                    {
                        possible_hand[0] = currentHand[c1];
                        possible_hand[1] = currentHand[c2];
                        possible_hand[2] = currentHand[c3];

                        var myStat = {
                            hold_cards: [possible_hand[0], possible_hand[1], possible_hand[2] ],
                            win_count: 0,
                            win_average: 0,
                            win_amount_avg: 0
                        };

                        //if (possible_hand[0].value == possible_hand[1].value
                        //    || possible_hand[0].value == possible_hand[2].value
                        //    || possible_hand[1].value == possible_hand[2].value)
                        //    hasPair = true;
                        //else
                        //    hasPair = false;


                        win_count = 0;
                        win_amount = 0;
                        for (var d1 = 5; d1 <= iDeckCount - 2; d1++)
                        {
                            for (var d2 = (d1 + 1); d2 <= iDeckCount - 1; d2++)
                            {
                                possible_hand[3] = currentDeck[d1];
                                possible_hand[4] = currentDeck[d2];

                                payback = payout.EvaluateHand(possible_hand, false);
                                if (payback != 0)
                                {
                                    win_count += 1;
                                    win_amount += payback;
                                }
                            }
                        }

                        myStat.win_count = win_count;
                        myStat.win_average = win_count / max_hands;
                        myStat.win_amount_avg = win_amount / win_count;

                        myStats.push(myStat);
                    }
                }
            }

            //console.log("Drawtwo - output", myStats);
            return myStats;
        };

        var DrawThreeCards = function(currentDeck, currentHand)
        {
            console.log("In DrawThreeCards...");
            var possible_hand = [currentHand[0], currentHand[1], currentHand[2], currentHand[3], currentHand[4]];
            var myStats = [];

            var iDeckCount = currentDeck.length;
            var iHandCount = currentHand.length;
            //Cards.VegasPayoutHands payback;
            var payback;
            var win_count = 0;
            var win_amount = 0;
            //var idx = 0;

            var max_hands = ((iDeckCount - 5) * (iDeckCount - 6) * (iDeckCount - 7)) / 6;

            //var hasPair;

            for (var c1 = 0; c1 <= iHandCount - 2; c1++)
            {
                for (var c2 = c1 + 1; c2 <= iHandCount - 1; c2++)
                {

                    possible_hand[0] = currentHand[c1];
                    possible_hand[1] = currentHand[c2];
                    //myStats[idx] = new Stats(2);

                    var myStat = {
                        hold_cards: [possible_hand[0], possible_hand[1] ],
                        win_count: 0,
                        win_average: 0,
                        win_amount_avg: 0
                    };

                    win_count = 0;
                    win_amount = 0;
                    //hasPair = (possible_hand[0].rank == possible_hand[1].rank);

                    for (var d1 = 5; d1 <= iDeckCount - 3; d1++)
                    {
                        for (var d2 = (d1 + 1); d2 <= iDeckCount - 2; d2++)
                        {
                            for (var d3 = (d2 + 1); d3 <= iDeckCount - 1; d3++)
                            {
                                possible_hand[2] = currentDeck[d1];
                                possible_hand[3] = currentDeck[d2];
                                possible_hand[4] = currentDeck[d3];

                                payback = payout.EvaluateHand(possible_hand, false);
                                if (payback != 0)
                                {
                                    win_count += 1;
                                    win_amount += payback;
                                }
                            }
                        }
                    }

                    myStat.win_count = win_count;
                    myStat.win_average = win_count / max_hands;
                    myStat.win_amount_avg = win_amount / win_count;

                    myStats.push(myStat);
                }
            }


            // add to list
            //for (var h1 in myStats)
            //{
            //  ListofBestHold.push(h1);
            // }

            //console.log("DrawThree - output", myStats);

            return myStats;
        };

        /// <summary>
        /// This will give us a rough estimate of values based on the number of high cards they have.
        /// This will avoid running 300,000 scenarios when drawing 4 cards.
        /// </summary>
        var DrawFourofNothing = function(currentDeck, currentHand) {
            console.log("In DrawFourofNothing...");
            var highCardCount = 0;
            var allStats = [];
            for (var c1 = 0; c1 <= currentHand.length - 1; c1++)
            {
                switch (currentHand[c1].rank)
                {
                    case "A":
                    case "J":
                    case "Q":
                    case "K":
                        highCardCount++;
                        break;
                }
            }

            for (c1 = 0; c1 <= currentHand.length - 1; c1++)
            {
                var myStats = {
                    hold_cards: [currentHand[c1]],
                    win_count: 55000
                };

                switch (currentHand[c1].rank)
                {
                    case "A":
                    case "J":
                    case "Q":
                    case "K":
                        if (highCardCount == 1)
                        {
                            myStats.win_average = 0.3329;
                            myStats.win_amount_avg = 1.41;
                        }
                        else if (highCardCount == 2)
                        {
                            myStats.win_average = 0.3229;
                            myStats.win_amount_avg = 1.41;
                        }
                        else if (highCardCount == 3)
                        {
                            myStats.win_average = 0.31;
                            myStats.win_amount_avg = 1.42;
                        }
                        else
                        {
                            myStats.win_average = 0.302;
                            myStats.win_amount_avg = 1.43;
                        }

                        break;
                    default:
                        if (highCardCount == 0)
                        {
                            myStats.win_average = 0.179;
                            myStats.win_amount_avg = 1.79;
                        }
                        else if (highCardCount == 1)
                        {
                            myStats.win_average = 0.1674;
                            myStats.win_amount_avg = 1.84;
                        }
                        else if (highCardCount == 2)
                        {
                            myStats.win_average = 0.1552;
                            myStats.win_amount_avg = 1.90;
                        }
                        else if (highCardCount == 3)
                        {
                            myStats.win_average = 0.144;
                            myStats.win_amount_avg = 1.97;
                        }
                        else if (highCardCount == 4)
                        {
                            myStats.win_average = 0.1298;
                            myStats.win_amount_avg = 1.99;
                        }
                        break;
                }
                allStats.push(myStats);
            }

            console.log("allStats", allStats);
            return allStats;
        };


    }])

    .controller('PracticeCtrl', ['$rootScope', '$filter', '$scope', 'cards', 'payout', 'calculate', 'handAnalyzer',
        function($rootScope, $filter, $scope, cards, payout, calculate, handAnalyzer) {
        console.log("In PracticeCtrl...");

        // set navbar
        $scope.activeHome = "";
        $scope.activeBasics = "";
        $scope.activeTactics = "";
        $scope.activePractice = "active";
        var deck = cards.createDeck();

        $scope.deck = deck;  // default to new deck
        var localHand = [deck[0], deck[1], deck[2], deck[3], deck[4]];

        console.log("localHand", localHand);

        $scope.pokerHand = localHand;
        $scope.evaluation = '';
        $scope.correctWrong = '';
        $scope.bestHolds = [];
        $scope.optimalCount = 0;

        setTimeout(function() {$('.flip-card').addClass('flipped');}, 1000);

        $scope.pokerHand_old = [
            {rank: '10', suit: '♣', color: '', hold: ''},
            {rank: 'J', suit: '♣', color: '', hold: ''},
            {rank: 'Q', suit: '♣', color: '', hold: ''},
            {rank: 'K', suit: '♣', color: '', hold: ''},
            {rank: 'A', suit: '♣', color: '', hold: ''}
        ];


        var goTop = function() {
            //angular.element("#scrollable-area")[0].scrollTop=0;
            $('#scrollable-area').scrollTop(0);
        };

        var flipCard = function() {
            setTimeout(function() {$('.flip-card').addClass('flipped');}, 0);
            setTimeout(function() {$('.flip-card').removeClass('flipped');}, 500);
        };

            var flipOneCard = function(id) {
                setTimeout(function() {$('#' + id).addClass('flipped');}, 0);
                setTimeout(function() {$('#' + id).removeClass('flipped');}, 500);
            };

        $scope.onCardClick = function(card) {
            if (card.hold == 'HOLD') {
                card.hold = '.';
            }
            else {
                card.hold = 'HOLD';
            }
            $scope.evaluation = "";
        };

        $scope.onDealClick = function(currentDeck) {

            // make sure the hand is set to HOLD anymore
            for (var i = 1; i < 52; i++) {
                currentDeck[i].hold = ".";
            }

            $scope.correctWrong = '';

            flipCard();

            var shuffledDeck = cards.vegasShuffle(currentDeck);
            localHand = [shuffledDeck[0], shuffledDeck[1], shuffledDeck[2], shuffledDeck[3], shuffledDeck[4]];

            var result = payout.InterpretHand(localHand);
            //console.log("result: " + result);
            $scope.handPayout = result;
            $scope.evaluation = "";
            $scope.deck = shuffledDeck;
            // deal cards here
            $scope.pokerHand = localHand;

            // populate optimal selection matrix here
            var myHolds = calculate.CalculatePokerOdds(currentDeck, localHand);
            //console.log("bestHolds", myHolds);
            $scope.bestHolds = myHolds;

            goTop();
        };

        $scope.onDrawClick = function(pokerHand, currentDeck) {
            // first determine which cards to discard
            var nextPos = 5;
            if (pokerHand[0].hold != 'HOLD') {
                pokerHand[0] = currentDeck[nextPos];
                nextPos = nextPos + 1;
            }
            if (pokerHand[1].hold != 'HOLD') {
                pokerHand[1] = currentDeck[nextPos];
                nextPos = nextPos + 1;
            }
            if (pokerHand[2].hold != 'HOLD') {
                pokerHand[2] = currentDeck[nextPos];
                nextPos = nextPos + 1;
            }
            if (pokerHand[3].hold != 'HOLD') {
                pokerHand[3] = currentDeck[nextPos];
                nextPos = nextPos + 1;
            }
            if (pokerHand[4].hold != 'HOLD') {
                pokerHand[4] = currentDeck[nextPos];
            }

            var result = payout.InterpretHand(pokerHand);
            console.log("result: " + result);
            $scope.handPayout = result;
            $scope.evaluation = "";
            $scope.correctWrong = '';

        };

        $scope.onFlipClick = function() {
            flipCard();
        };

        $scope.onAnalyzeClick = function(pokerHand) {
            var adviceObject = handAnalyzer.Analyze(pokerHand);
            var myDebugger = false;
            if (myDebugger) {
                console.log("result: ", adviceObject);
            }

            $scope.evaluation = adviceObject.advice;

            var holdHand = adviceObject.holdCards;
            var holdCount = 0;

            if (pokerHand[0].hold == 'HOLD') holdCount++;
            if (pokerHand[1].hold == 'HOLD') holdCount++;
            if (pokerHand[2].hold == 'HOLD') holdCount++;
            if (pokerHand[3].hold == 'HOLD') holdCount++;
            if (pokerHand[4].hold == 'HOLD') holdCount++;


            if (myDebugger) {
                console.log("holdCount: " + holdCount);
                console.log("holdHand.length: " + holdHand.length);
            }

            // default to correct
            $scope.correctWrong = "Correct!";
            $scope.optimalCount++;

            if (holdCount == 0 && adviceObject.isPaiGow == true) {
                $scope.correctWrong = "Correct!";
                //$scope.optimalCount++;
            }
            else if(holdCount == 0 && adviceObject.isPaiGow == false) {
                $scope.correctWrong = "Wrong!";
                $scope.optimalCount = 0;
            }
            else if (holdCount > 0 && adviceObject.isPaiGow == true)
            {
                $scope.correctWrong = "Wrong!";
                $scope.optimalCount = 0;
            }
            else if (holdCount > 0 && holdCount != holdHand.length)
            {
                $scope.correctWrong = "Wrong!";
                $scope.optimalCount = 0;
            }
            else if (holdCount > 0 && holdCount == holdHand.length) {
                // lets compare the cards to make sure they match

                var myHoldCards = [];
                if (pokerHand[0].hold == 'HOLD') myHoldCards.push(pokerHand[0]);
                if (pokerHand[1].hold == 'HOLD') myHoldCards.push(pokerHand[1]);
                if (pokerHand[2].hold == 'HOLD') myHoldCards.push(pokerHand[2]);
                if (pokerHand[3].hold == 'HOLD') myHoldCards.push(pokerHand[3]);
                if (pokerHand[4].hold == 'HOLD') myHoldCards.push(pokerHand[4]);

                if (myDebugger) {
                    console.log("myHoldCards", myHoldCards);
                    console.log("holdHand", holdHand);
                }

                outerloop:
                    for (var i=0; i<holdHand.length; i++) {
                        for (var j=0; j<myHoldCards.length; j++) {
                            if (myHoldCards[j].cardOutput == holdHand[i].cardOutput) {
                                continue outerloop;
                            }
                        }
                        $scope.correctWrong = "Wrong!";
                        $scope.optimalCount = 0;
                    }
            }
            else {
                // should not be here
                $scope.correctWrong = "Error!"
            }

        };
    }])
;
