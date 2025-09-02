import React, { useEffect, useMemo, useState } from "react";
import {
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

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

function makeDeck(): Card[] {
  const deck: Card[] = [];
  for (const s of SUITS) {
    for (const { r, v } of RANKS) deck.push({ rank: r, suit: s, value: v });
  }
  // Fisher–Yates
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
    if (c.rank === "A") aces += 1;
  }
  // Upgrade Aces from 1 to 11 where possible
  while (aces > 0 && total + 10 <= 21) {
    total += 10;
    aces -= 1;
  }
  return total;
}

function cardStr(c: Card) {
  const isRed = c.suit === "♥" || c.suit === "♦";
  return { text: `${c.rank}${c.suit}`, isRed };
}

const Profile = () => {
  const [deck, setDeck] = useState<Card[]>([]);
  const [player, setPlayer] = useState<Card[]>([]);
  const [dealer, setDealer] = useState<Card[]>([]);
  const [phase, setPhase] = useState<"ready" | "player" | "dealer" | "done">(
    "ready"
  );
  const [message, setMessage] = useState<string>("");

  const playerTotal = useMemo(() => handValue(player), [player]);
  const dealerTotal = useMemo(() => handValue(dealer), [dealer]);

  const [balance, setBalance] = useState(1000);
  useEffect(() => {
    // initial shoe
    setDeck(makeDeck());
  }, []);

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
     if (balance <= 0) {
      setMessage("Mungugue gcimine");
      return;
    }
    const fresh = deck.length < 10 ? makeDeck() : deck.slice();
    const { drawn: p2, nextDeck: d1 } = draw(2, fresh);
    const { drawn: d2, nextDeck: d2Deck } = draw(2, d1);
    setDeck(d2Deck);
    setPlayer(p2);
    setDealer(d2);
    setPhase("player");
    setMessage("");

    const pt = handValue(p2);
    const dt = handValue(d2);
    if (pt === 21 && dt === 21) {
      setPhase("done");
      setMessage("Push: double Blackjack!");
    } else if (pt === 21) {
      setPhase("done");
      setMessage("Blackjack! You win 🎉");
    }
  }

  function hit() {
    if (phase !== "player") return;
    const { drawn } = draw(1);
    const newHand = [...player, ...drawn];
    setPlayer(newHand);
    const total = handValue(newHand);
    if (total > 21) {
      setPhase("done");
      setMessage("Bust! Dealer wins.");
      setBalance((prev) => prev - 100);
    }
  }

  function stand() {
    if (phase !== "player") return;
    setPhase("dealer");
    // Dealer draws to 17+
    let dHand = dealer.slice();
    while (handValue(dHand) < 17) {
      const { drawn } = draw(1);
      dHand = [...dHand, ...drawn];
    }
    setDealer(dHand);
    const p = handValue(player);
    const d = handValue(dHand);
    if (d > 21) {
      setMessage("Dealer busts. You win 🎉");
      setBalance((prev) => prev + 100); // win
    } else if (p > d) {
      setMessage("You win 🎉");
      setBalance((prev) => prev + 100);
    } else if (p < d) {
      setMessage("Dealer wins.");
      setBalance((prev) => prev - 100); // lose
    } else {
      setMessage("Push.");
    }
    setPhase("done");
  }

  function reset() {
    setPlayer([]);
    setDealer([]);
    setMessage("");
    setPhase("ready");
  }

  const hiddenDealerHand = useMemo(() => {
    if (phase === "player") {
      // show first card only
      return dealer.length > 0 ? [dealer[0]] : [];
    }
    return dealer;
  }, [dealer, phase]);


  return (
    <View style={styles.container}>
      <Text style={styles.title}>Blackjack</Text>
      <Text style={styles.balance}>Balance: ${balance}</Text>

      <View style={styles.row}>
        <Text style={styles.heading}>Dealer</Text>
        <Text style={styles.total}>
          {phase === "player" ? "?" : dealerTotal}
        </Text>
      </View>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        style={styles.hand}
      >
        {hiddenDealerHand.map((c, i) => (
          <CardPill
            key={`${c.rank}${c.suit}-${i}`}
            card={c}
            hidden={phase === "player" && i === 1}
          />
        ))}
        {phase === "player" && dealer.length >= 2 && <HiddenCard />}
      </ScrollView>

      <View style={styles.divider} />

      <View style={styles.row}>
        <Text style={styles.heading}>You</Text>
        <Text style={styles.total}>{playerTotal}</Text>
      </View>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        style={styles.hand}
      >
        {player.map((c, i) => (
          <CardPill key={`${c.rank}${c.suit}-${i}`} card={c} />
        ))}
      </ScrollView>

      <Text style={styles.message}>{message}</Text>

      <View style={styles.buttons}>
        {phase === "ready" && <PrimaryButton label="Deal" onPress={deal} />}
        {phase === "player" && (
          <>
            <PrimaryButton label="Hit" onPress={hit} />
            <PrimaryButton label="Stand" onPress={stand} />
          </>
        )}
        {phase === "done" && (
          <>
            <PrimaryButton label="New Round" onPress={deal} />
            <SecondaryButton label="Reset Shoe" onPress={reset} />
          </>
        )}
      </View>
    </View>
  );
};

const CardPill = ({
  card,
  hidden = false,
}: {
  card: Card;
  hidden?: boolean;
}) => {
  if (hidden) return <HiddenCard />;
  const { text, isRed } = cardStr(card);
  return (
    <View style={styles.card}>
      <Text style={[styles.cardText, isRed && { color: "#d11" }]}>{text}</Text>
    </View>
  );
};

const HiddenCard = () => (
  <View style={[styles.card, styles.hiddenCard]}>
    <Text style={styles.cardBack}>◆◆</Text>
  </View>
);

const PrimaryButton = ({
  label,
  onPress,
}: {
  label: string;
  onPress: () => void;
}) => (
  <TouchableOpacity onPress={onPress} style={styles.primaryBtn}>
    <Text style={styles.primaryBtnText}>{label}</Text>
  </TouchableOpacity>
);

const SecondaryButton = ({
  label,
  onPress,
}: {
  label: string;
  onPress: () => void;
}) => (
  <TouchableOpacity onPress={onPress} style={styles.secondaryBtn}>
    <Text style={styles.secondaryBtnText}>{label}</Text>
  </TouchableOpacity>
);

export default Profile;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 60,
    paddingHorizontal: 16,
    backgroundColor: "#0b0b0f",
  },
  title: {
    fontSize: 28,
    fontWeight: "800",
    color: "white",
    textAlign: "center",
    marginBottom: 12,
  },
  heading: { fontSize: 20, fontWeight: "700", color: "white" },
  total: { fontSize: 20, fontWeight: "700", color: "#9ae6b4" },
  row: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  hand: { marginTop: 8, marginBottom: 16 },
  card: {
    borderWidth: 1,
    borderColor: "#333",
    paddingVertical: 12,
    paddingHorizontal: 14,
    borderRadius: 12,
    marginRight: 8,
    backgroundColor: "#16161d",
  },
  cardText: { fontSize: 18, fontWeight: "700", color: "white" },
  hiddenCard: { backgroundColor: "#243", borderColor: "#2f4f4f" },
  cardBack: { color: "white", fontWeight: "800" },
  divider: { height: 1, backgroundColor: "#23232b", marginVertical: 12 },
  message: {
    textAlign: "center",
    color: "white",
    minHeight: 28,
    fontSize: 16,
    marginTop: 8,
  },
  buttons: {
    flexDirection: "row",
    gap: 12,
    justifyContent: "center",
    flexWrap: "wrap",
    marginTop: 16,
    marginBottom: 100,
  },
  primaryBtn: {
    backgroundColor: "#2563eb",
    paddingVertical: 12,
    paddingHorizontal: 18,
    borderRadius: 12,
  },
  balance: { 
  fontSize: 18, 
  fontWeight: "700", 
  color: "#facc15", 
  textAlign: "center", 
  marginBottom: 8 
},
  primaryBtnText: { color: "white", fontWeight: "700", fontSize: 16 },
  secondaryBtn: {
    borderWidth: 1,
    borderColor: "#555",
    paddingVertical: 12,
    paddingHorizontal: 18,
    borderRadius: 12,
  },
  secondaryBtnText: { color: "#ddd", fontWeight: "700", fontSize: 16 },
});
