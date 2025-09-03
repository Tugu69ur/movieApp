import React, { useEffect, useMemo, useRef, useState } from "react";
import {
  Animated,
  Dimensions,
  Easing,
  Image,
  ImageBackground,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

// Screen dimensions available for future use
const { width: screenWidth } = Dimensions.get("window");

type Card = { rank: string; suit: string; value: number };

const SUITS = ["♠", "♥", "♦", "♣"];
const RANKS: { r: string; v: number }[] = [
  { r: "A", v: 1 },
  { r: "2", v: 2 },
  { r: "3", v: 3 },
  { r: "4", v: 4 },
  { r: "5", v: 5 },
  { r: "6", v: 6 },
  { r: "7", v: 7 },
  { r: "8", v: 8 },
  { r: "9", v: 9 },
  { r: "10", v: 10 },
  { r: "J", v: 10 },
  { r: "Q", v: 10 },
  { r: "K", v: 10 },
];

// make shuffled deck
function makeDeck(): Card[] {
  const deck: Card[] = [];
  for (const s of SUITS) {
    for (const { r, v } of RANKS) deck.push({ rank: r, suit: s, value: v });
  }
  for (let i = deck.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [deck[i], deck[j]] = [deck[j], deck[i]];
  }
  return deck;
}

function handValue(hand: Card[]): number {
  let total = 0;
  let aces = 0;
  for (const c of hand) {
    total += c.value;
    if (c.rank === "A") aces++;
  }
  while (aces > 0 && total + 10 <= 21) {
    total += 10;
    aces--;
  }
  return total;
}

function cardStr(c: Card) {
  const isRed = c.suit === "♥" || c.suit === "♦";
  return { text: c.rank, suit: c.suit, isRed };
}

const Blackjack = () => {
  const [deck, setDeck] = useState<Card[]>([]);
  const [player, setPlayer] = useState<Card[]>([]);
  const [dealer, setDealer] = useState<Card[]>([]);
  const [phase, setPhase] = useState<"ready" | "player" | "dealer" | "done">(
    "ready"
  );
  const [message, setMessage] = useState("");
  const [balance, setBalance] = useState(1000);
  const [betAmount, setBetAmount] = useState(100);
  const [showBetSlider, setShowBetSlider] = useState(false);

  // Animation values
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(-50)).current;
  const cardFlipAnim = useRef(new Animated.Value(0)).current;
  const balanceAnim = useRef(new Animated.Value(1)).current;
  const messageAnim = useRef(new Animated.Value(0)).current;
  const dealerCardAnim = useRef(new Animated.Value(0)).current;

  const playerTotal = useMemo(() => handValue(player), [player]);
  const dealerTotal = useMemo(() => handValue(dealer), [dealer]);

  useEffect(() => {
    // Initial animations
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 1000,
        easing: Easing.out(Easing.cubic),
        useNativeDriver: true,
      }),
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 800,
        easing: Easing.out(Easing.back(1.2)),
        useNativeDriver: true,
      }),
    ]).start();
  }, [fadeAnim, slideAnim]);

  useEffect(() => {
    setDeck(makeDeck());
  }, []);

  const animateBalance = (newBalance: number) => {
    Animated.sequence([
      Animated.timing(balanceAnim, {
        toValue: 1.2,
        duration: 200,
        useNativeDriver: true,
      }),
      Animated.timing(balanceAnim, {
        toValue: 1,
        duration: 200,
        useNativeDriver: true,
      }),
    ]).start();
  };

  const animateMessage = (msg: string) => {
    setMessage(msg);
    Animated.sequence([
      Animated.timing(messageAnim, {
        toValue: 0,
        duration: 150,
        useNativeDriver: true,
      }),
      Animated.timing(messageAnim, {
        toValue: 1,
        duration: 300,
        useNativeDriver: true,
      }),
    ]).start();
  };

  const animateCardDeal = (cardIndex: number, isDealer: boolean = false) => {
    const delay = cardIndex * 200;
    const animValue = new Animated.Value(0);

    setTimeout(() => {
      Animated.timing(animValue, {
        toValue: 1,
        duration: 400,
        easing: Easing.out(Easing.back(1.5)),
        useNativeDriver: true,
      }).start();
    }, delay);

    return animValue;
  };

  function draw(n = 1, from?: Card[]) {
    let d = from ?? deck.slice();
    const drawn: Card[] = [];
    for (let i = 0; i < n; i++) {
      if (d.length === 0) d = makeDeck();
      drawn.push(d.pop()!);
    }
    if (!from) setDeck(d);
    return { drawn, nextDeck: d };
  }

  function deal() {
    if (balance < betAmount) {
      animateMessage("You don't have enough money to play!");
      return;
    }

    setBalance((prev) => prev - betAmount);
    animateBalance(balance - betAmount);

    const fresh = deck.length < 10 ? makeDeck() : deck.slice();
    const { drawn: p2, nextDeck: d1 } = draw(2, fresh);
    const { drawn: d2, nextDeck: d2Deck } = draw(2, d1);

    setDeck(d2Deck);
    setPlayer(p2);
    setDealer(d2);
    setPhase("player");
    setMessage("");

    // Animate dealer's second card reveal
    setTimeout(() => {
      Animated.timing(dealerCardAnim, {
        toValue: 1,
        duration: 600,
        easing: Easing.out(Easing.cubic),
        useNativeDriver: true,
      }).start();
    }, 1000);
  }

  function hit() {
    if (phase !== "player") return;
    const { drawn } = draw(1);
    const newHand = [...player, ...drawn];
    setPlayer(newHand);

    if (handValue(newHand) > 21) {
      setPhase("done");
      animateMessage("Bust! Dealer wins.");
    }
  }

  function stand() {
    if (phase !== "player") return;
    setPhase("dealer");

    let dHand = dealer.slice();

    const dealerHitInterval = setInterval(() => {
      if (handValue(dHand) >= 17) {
        clearInterval(dealerHitInterval);

        setDealer(dHand);
        const p = handValue(player);
        const d = handValue(dHand);

        if (d > 21 || p > d) {
          animateMessage("You win 🎉");
          setBalance((prev) => prev + betAmount * 2);
          animateBalance(balance + betAmount);
        } else if (p < d) {
          animateMessage("Dealer wins.");
        } else {
          animateMessage("Push.");
          setBalance((prev) => prev + betAmount);
          animateBalance(balance);
        }
        setPhase("done");
      } else {
        const { drawn } = draw(1);
        dHand = [...dHand, ...drawn];
      }
    }, 800);
  }

  function reset() {
    setPlayer([]);
    setDealer([]);
    setMessage("");
    setPhase("ready");
    setBetAmount(100);
    setShowBetSlider(false);

    // Reset animations
    dealerCardAnim.setValue(0);
    cardFlipAnim.setValue(0);
  }

  const hiddenDealerHand = useMemo(() => {
    if (phase === "player") {
      return dealer.length > 0 ? [dealer[0]] : [];
    }
    return dealer;
  }, [dealer, phase]);

  return (
    <ImageBackground
      source={require("../../assets/bj/bg.png")}
      style={styles.bg}
      resizeMode="cover"
    >
      <Animated.View
        style={[
          styles.container,
          { opacity: fadeAnim, transform: [{ translateY: slideAnim }] },
        ]}
      >
        <View style={styles.header}>
          <Text style={styles.title}>Blackjack</Text>
          <Animated.Text
            style={[styles.balance, { transform: [{ scale: balanceAnim }] }]}
          >
            Balance: ${balance}
          </Animated.Text>
        </View>

        {phase === "ready" && (
          <View style={styles.betSection}>
            <TouchableOpacity
              style={styles.betButton}
              onPress={() => setShowBetSlider(!showBetSlider)}
            >
              <Text style={styles.betButtonText}>Bet: ${betAmount}</Text>
            </TouchableOpacity>

            {showBetSlider && (
              <View style={styles.betSliderContainer}>
                <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                  {[50, 100, 200, 500, 1000].map((amount) => (
                    <TouchableOpacity
                      key={amount}
                      style={[
                        styles.betOption,
                        betAmount === amount && styles.betOptionSelected,
                      ]}
                      onPress={() => {
                        setBetAmount(amount);
                        setShowBetSlider(false);
                      }}
                    >
                      <Text
                        style={[
                          styles.betOptionText,
                          betAmount === amount && styles.betOptionTextSelected,
                        ]}
                      >
                        ${amount}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </ScrollView>
              </View>
            )}
          </View>
        )}

        <View style={styles.gameArea}>
          <View style={styles.playerSection}>
            <View style={styles.row}>
              <Text style={styles.heading}>Dealer</Text>
              <Text style={styles.total}>
                {phase === "player" ? "?" : dealerTotal}
              </Text>
            </View>
            <ScrollView
              horizontal
              style={styles.hand}
              showsHorizontalScrollIndicator={false}
            >
              {hiddenDealerHand.map((c, i) => (
                <AnimatedCardImage
                  key={i}
                  card={c}
                  hidden={phase === "player" && i === 1}
                  animationValue={animateCardDeal(i, true)}
                  isDealer={true}
                  dealerCardAnim={dealerCardAnim}
                />
              ))}
              {phase === "player" && dealer.length >= 2 && (
                <AnimatedCardImage
                  hidden
                  animationValue={animateCardDeal(1, true)}
                  isDealer={true}
                  dealerCardAnim={dealerCardAnim}
                />
              )}
            </ScrollView>
          </View>

          <View style={styles.divider} />

          <View style={styles.playerSection}>
            <View style={styles.row}>
              <Text style={styles.heading}>You</Text>
              <Text style={styles.total}>{playerTotal}</Text>
            </View>
            <ScrollView
              horizontal
              style={styles.hand}
              showsHorizontalScrollIndicator={false}
            >
              {player.map((c, i) => (
                <AnimatedCardImage
                  key={i}
                  card={c}
                  animationValue={animateCardDeal(i, false)}
                />
              ))}
            </ScrollView>
          </View>
        </View>

        <Animated.Text style={[styles.message, { opacity: messageAnim }]}>
          {message}
        </Animated.Text>

        <View style={styles.buttons}>
          {phase === "ready" && (
            <PrimaryButton
              label="Deal"
              onPress={deal}
              disabled={balance < betAmount}
            />
          )}
          {phase === "player" && (
            <>
              <PrimaryButton label="Hit" onPress={hit} />
              <PrimaryButton label="Stand" onPress={stand} />
            </>
          )}
          {phase === "done" && (
            <>
              <PrimaryButton label="New Round" onPress={deal} />
              <SecondaryButton label="Reset" onPress={reset} />
            </>
          )}
        </View>
      </Animated.View>
    </ImageBackground>
  );
};

const AnimatedCardImage = ({
  card,
  hidden,
  animationValue,
  isDealer = false,
  dealerCardAnim,
}: {
  card?: Card;
  hidden?: boolean;
  animationValue?: Animated.Value;
  isDealer?: boolean;
  dealerCardAnim?: Animated.Value;
}) => {
  const scaleAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (animationValue) {
      Animated.timing(scaleAnim, {
        toValue: 1,
        duration: 400,
        easing: Easing.out(Easing.back(1.5)),
        useNativeDriver: true,
      }).start();
    }
  }, [animationValue, scaleAnim]);

  if (hidden) {
    return (
      <Animated.View
        style={[styles.cardContainer, { transform: [{ scale: scaleAnim }] }]}
      >
        <Image
          source={require("../../assets/bj/back.png")}
          style={styles.card}
          resizeMode="contain"
        />
      </Animated.View>
    );
  }

  if (!card) return null;

  const { text, suit, isRed } = cardStr(card);

  return (
    <Animated.View
      style={[
        styles.cardContainer,
        {
          transform: [
            { scale: scaleAnim },
            ...(isDealer && dealerCardAnim
              ? [
                  {
                    rotateY: dealerCardAnim.interpolate({
                      inputRange: [0, 1],
                      outputRange: ["0deg", "180deg"],
                    }),
                  },
                ]
              : []),
          ],
        },
      ]}
    >
      <ImageBackground
        source={require("../../assets/bj/cardfront.png")}
        style={styles.card}
        resizeMode="contain"
      >
        <Text style={[styles.cardText, isRed && { color: "red" }]}>{text}</Text>
        <Text style={[styles.cardSuit, isRed && { color: "red" }]}>{suit}</Text>
      </ImageBackground>
    </Animated.View>
  );
};

const PrimaryButton = ({
  label,
  onPress,
  disabled = false,
}: {
  label: string;
  onPress: () => void;
  disabled?: boolean;
}) => {
  const scaleAnim = useRef(new Animated.Value(1)).current;

  const handlePressIn = () => {
    Animated.timing(scaleAnim, {
      toValue: 0.95,
      duration: 100,
      useNativeDriver: true,
    }).start();
  };

  const handlePressOut = () => {
    Animated.timing(scaleAnim, {
      toValue: 1,
      duration: 100,
      useNativeDriver: true,
    }).start();
  };

  return (
    <TouchableOpacity
      onPress={onPress}
      onPressIn={handlePressIn}
      onPressOut={handlePressOut}
      disabled={disabled}
      style={[styles.primaryBtn, disabled && styles.disabledBtn]}
    >
      <Animated.View style={{ transform: [{ scale: scaleAnim }] }}>
        <Text
          style={[styles.primaryBtnText, disabled && styles.disabledBtnText]}
        >
          {label}
        </Text>
      </Animated.View>
    </TouchableOpacity>
  );
};

const SecondaryButton = ({
  label,
  onPress,
}: {
  label: string;
  onPress: () => void;
}) => {
  const scaleAnim = useRef(new Animated.Value(1)).current;

  const handlePressIn = () => {
    Animated.timing(scaleAnim, {
      toValue: 0.95,
      duration: 100,
      useNativeDriver: true,
    }).start();
  };

  const handlePressOut = () => {
    Animated.timing(scaleAnim, {
      toValue: 1,
      duration: 100,
      useNativeDriver: true,
    }).start();
  };

  return (
    <TouchableOpacity
      onPress={onPress}
      onPressIn={handlePressIn}
      onPressOut={handlePressOut}
      style={styles.secondaryBtn}
    >
      <Animated.View style={{ transform: [{ scale: scaleAnim }] }}>
        <Text style={styles.secondaryBtnText}>{label}</Text>
      </Animated.View>
    </TouchableOpacity>
  );
};

export default Blackjack;

const styles = StyleSheet.create({
  bg: {
    flex: 1,
    height: "100%",
    width: "100%",
  },
  container: {
    flex: 1,
    paddingTop: 60,
    paddingHorizontal: 16,
  },
  header: {
    alignItems: "center",
    marginBottom: 20,
  },
  title: {
    fontSize: 32,
    fontWeight: "800",
    color: "white",
    textAlign: "center",
    marginBottom: 8,
    textShadowColor: "rgba(0, 0, 0, 0.75)",
    textShadowOffset: { width: 2, height: 2 },
    textShadowRadius: 4,
  },
  balance: {
    fontSize: 20,
    fontWeight: "700",
    color: "#facc15",
    textAlign: "center",
    marginBottom: 12,
    textShadowColor: "rgba(0, 0, 0, 0.75)",
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 2,
  },
  betSection: {
    alignItems: "center",
    marginBottom: 20,
  },
  betButton: {
    backgroundColor: "rgba(255, 255, 255, 0.1)",
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.3)",
  },
  betButtonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "600",
  },
  betSliderContainer: {
    marginTop: 10,
    paddingHorizontal: 10,
  },
  betOption: {
    backgroundColor: "rgba(255, 255, 255, 0.1)",
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 16,
    marginHorizontal: 4,
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.2)",
  },
  betOptionSelected: {
    backgroundColor: "#2563eb",
    borderColor: "#2563eb",
  },
  betOptionText: {
    color: "white",
    fontSize: 14,
    fontWeight: "600",
  },
  betOptionTextSelected: {
    color: "white",
    fontWeight: "700",
  },
  gameArea: {
    flex: 1,
    marginBottom: 140,
  },
  playerSection: {
    marginBottom: 20,
  },
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 8,
  },
  heading: {
    fontSize: 22,
    fontWeight: "700",
    color: "white",
    textShadowColor: "rgba(0, 0, 0, 0.75)",
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 2,
  },
  total: {
    fontSize: 22,
    fontWeight: "700",
    color: "#9ae6b4",
    textShadowColor: "rgba(0, 0, 0, 0.75)",
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 2,
  },
  hand: {
    marginVertical: 12,
    paddingHorizontal: 4,
  },
  cardContainer: {
    marginRight: 8,
  },
  card: {
    width: 80,
    height: 120,
    borderRadius: 8,
    overflow: "hidden",
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 4.65,
    elevation: 8,
  },
  cardText: {
    fontSize: 22,
    fontWeight: "800",
    color: "black",
    textShadowColor: "rgba(255, 255, 255, 0.8)",
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 1,
  },
  cardSuit: {
    fontSize: 20,
    fontWeight: "700",
    marginTop: 4,
    color: "black",
    textShadowColor: "rgba(255, 255, 255, 0.8)",
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 1,
  },
  divider: {
    height: 2,
    backgroundColor: "rgba(255,255,255,0.3)",
    marginVertical: 20,
    borderRadius: 1,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  message: {
    textAlign: "center",
    color: "white",
    fontSize: 18,
    minHeight: 30,
    marginTop: 8,
    marginBottom: 20,
    fontWeight: "600",
    textShadowColor: "rgba(0, 0, 0, 0.75)",
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 2,
  },
  buttons: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "center",
    gap: 16,
    marginTop: 10,
    marginBottom: 20,
    paddingHorizontal: 20,
    position: "absolute",
    bottom: 120,
    left: 0,
    right: 0,
  },
  primaryBtn: {
    backgroundColor: "#2563eb",
    paddingVertical: 14,
    paddingHorizontal: 24,
    borderRadius: 16,
    margin: 4,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 4.65,
    elevation: 8,
  },
  primaryBtnText: {
    color: "white",
    fontWeight: "700",
    fontSize: 16,
    textAlign: "center",
  },
  secondaryBtn: {
    borderWidth: 2,
    borderColor: "rgba(255,255,255,0.6)",
    paddingVertical: 14,
    paddingHorizontal: 24,
    borderRadius: 16,
    margin: 4,
    backgroundColor: "rgba(255, 255, 255, 0.1)",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  secondaryBtnText: {
    color: "rgba(255,255,255,0.9)",
    fontWeight: "700",
    fontSize: 16,
    textAlign: "center",
  },
  disabledBtn: {
    backgroundColor: "rgba(37, 99, 235, 0.5)",
    opacity: 0.6,
  },
  disabledBtnText: {
    color: "rgba(255, 255, 255, 0.7)",
  },
});
