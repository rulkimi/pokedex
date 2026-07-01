"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import PokemonImage from "../../[gen]/_components/pokemon-image";
import { Button } from "@/components/ui/button";
import { CheckCircle, Loader2, XCircle } from "lucide-react";
import { playPokemonCry, getPokemonGen } from "@/lib/utils";
import Link from "next/link";
import { fetchPokemonById, PokemonDetail } from "../../[gen]/actions";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";

function mulberry32(a: number) {
  return function() {
    var t = a += 0x6D2B79F5;
    t = Math.imul(t ^ t >>> 15, t | 1);
    t ^= t + Math.imul(t ^ t >>> 7, t | 61);
    return ((t ^ t >>> 14) >>> 0) / 4294967296;
  }
}

function getDailySeed() {
  const today = new Date();
  return today.getFullYear() * 10000 + (today.getMonth() + 1) * 100 + today.getDate();
}

function getDailyPokemons(): number[] {
  const seed = getDailySeed();
  const rng = mulberry32(seed);
  const pokemons = new Set<number>();
  while (pokemons.size < 10) { // Limit to 10
    pokemons.add(Math.floor(rng() * 1025) + 1);
  }
  return Array.from(pokemons);
}

const ALL_TYPES = ["normal", "fire", "water", "grass", "electric", "ice", "fighting", "poison", "ground", "flying", "psychic", "bug", "rock", "ghost", "dark", "dragon", "steel", "fairy"];

const RoamingPokemon = ({ id, onClick, isFleeing, isFlying, isWater }: { id: number, onClick: (id: number) => void, isFleeing: boolean, isFlying?: boolean, isWater?: boolean }) => {
  const [position, setPosition] = useState(() => {
    let initialY = Math.random() * 30 + 40; // Ground (40-70)
    if (isFlying) initialY = Math.random() * 35 + 5; // Sky (5-40)
    if (isWater && !isFlying) initialY = Math.random() * 20 + 75; // Water (75-95)
    return {
      x: Math.random() * 80 + 10,
      y: initialY
    };
  });
  
  useEffect(() => {
    const move = () => {
      setPosition(prev => {
        // Random walk: move by a random amount
        const dx = (Math.random() - 0.5) * 30;
        const dy = (Math.random() - 0.5) * (isFlying || isWater ? 20 : 15);
        
        // Keep within bounds
        let minY = 40;
        let maxY = 70;
        
        if (isFlying) {
          minY = 5;
          maxY = 40;
        } else if (isWater) {
          minY = 75;
          maxY = 90;
        }

        return {
          x: Math.max(10, Math.min(90, prev.x + dx)),
          y: Math.max(minY, Math.min(maxY, prev.y + dy))
        };
      });
      timeout = setTimeout(move, 3500); // 3.5s per step
    };
    
    // Stagger start times
    let timeout = setTimeout(move, Math.random() * 2000);
    return () => clearTimeout(timeout);
  }, [isFlying, isWater]);

  return (
    <motion.div
      initial={{ scale: 0, opacity: 0, left: `${position.x}%`, top: `${position.y}%` }}
      animate={{ 
        left: `${position.x}%`, 
        top: `${position.y}%`,
        scale: 1,
        opacity: isFleeing ? 0 : 1,
        x: isFleeing ? 500 : 0
      }}
      exit={{ scale: 0, opacity: 0 }}
      transition={{ 
        left: { duration: 3.5, ease: "linear" },
        top: { duration: 3.5, ease: "linear" },
        scale: { duration: 0.3 },
        opacity: { duration: isFleeing ? 1 : 0.3 },
        x: { duration: isFleeing ? 1 : 0 }
      }}
      className="absolute cursor-pointer -translate-x-1/2 -translate-y-1/2 z-10 hover:z-50 group"
      onClick={() => { if (!isFleeing) onClick(id); }}
      whileHover={{ scale: isFleeing ? 1 : 1.15 }}
      whileTap={{ scale: isFleeing ? 1 : 0.95 }}
    >
      <div className="relative">
        <div className="absolute inset-0 bg-white/30 dark:bg-black/30 rounded-full blur-md opacity-0 group-hover:opacity-100 transition-opacity" />
        <PokemonImage pokemonId={id} alt={`Wild Pokemon ${id}`} imageSize={140} className={`w-20 h-20 md:w-32 md:h-32 object-contain drop-shadow-2xl ${isFleeing ? "grayscale brightness-0" : ""}`} />
      </div>
    </motion.div>
  );
};

export default function CatchClient() {
  const [dailyPokemons, setDailyPokemons] = useState<number[]>([]);
  const [caughtPokemons, setCaughtPokemons] = useState<number[]>([]);
  const [activePokemons, setActivePokemons] = useState<number[]>([]);
  const [fleeingPokemons, setFleeingPokemons] = useState<number[]>([]);
  const [isLoaded, setIsLoaded] = useState(false);
  const [message, setMessage] = useState<{ title: string, desc?: string, type: 'success' | 'error' } | null>(null);
  const [hasCaughtToday, setHasCaughtToday] = useState(false);
  const [pokemonTypesMap, setPokemonTypesMap] = useState<Record<number, { isFlying: boolean, isWater: boolean }>>({});
  const [isBagOpen, setIsBagOpen] = useState(false);

  // Quiz state
  const [selectedPokemonId, setSelectedPokemonId] = useState<number | null>(null);
  const [quizData, setQuizData] = useState<any>(null);
  const [quizLoading, setQuizLoading] = useState(false);
  const [quizStep, setQuizStep] = useState(0);
  const [answers, setAnswers] = useState<boolean[]>([]);

  useEffect(() => {
    const daily = getDailyPokemons();
    setDailyPokemons(daily);
    
    let caught: number[] = [];
    let lastCaught = "";
    const todayStr = new Date().toDateString();

    try {
      const stored = localStorage.getItem("caughtPokemons");
      if (stored) {
        caught = JSON.parse(stored);
      }
      lastCaught = localStorage.getItem("lastCaughtDate") || "";
    } catch {}
    
    setCaughtPokemons(caught);
    
    if (lastCaught === todayStr) {
      setHasCaughtToday(true);
    }
    
    // Filter out already caught pokemons from the field
    const activeIds = daily.filter(id => !caught.includes(id));
    
    // Fetch types to determine if flying or water
    Promise.all(activeIds.map(id => fetchPokemonById(id))).then(details => {
      const map: Record<number, { isFlying: boolean, isWater: boolean }> = {};
      details.forEach((d, i) => {
        if (d) {
          const isFlying = d.types.includes("flying") || d.types.includes("bug") || d.abilities.some(a => a.name === "levitate");
          const isWater = d.types.includes("water") || d.types.includes("ice");
          map[activeIds[i]] = { isFlying, isWater };
        }
      });
      setPokemonTypesMap(map);
      setActivePokemons(activeIds);
      setIsLoaded(true);
    });
  }, []);

  const handlePokemonClick = async (id: number) => {
    if (hasCaughtToday) {
      setMessage({ type: 'error', title: "Daily Limit Reached", desc: "You have already caught a Pokémon today! Come back tomorrow." });
      setTimeout(() => setMessage(null), 3000);
      return;
    }
    
    setSelectedPokemonId(id);
    setQuizLoading(true);
    setQuizStep(0);
    setAnswers([]);
    setQuizData(null);

    try {
      const correct = await fetchPokemonById(id);
      if (!correct) throw new Error("Failed to load");

      const w1Id = Math.floor(Math.random() * 1025) + 1;
      const w2Id = Math.floor(Math.random() * 1025) + 1;
      const [w1, w2] = await Promise.all([
        fetchPokemonById(w1Id),
        fetchPokemonById(w2Id)
      ]);

      const nameOptions = [
        correct.name, 
        w1?.name || 'pikachu', 
        w2?.name || 'charizard'
      ].sort(() => Math.random() - 0.5);
      
      const generateWrongTypes = () => {
        const num = Math.random() > 0.5 ? 2 : 1;
        const shuffled = [...ALL_TYPES].sort(() => Math.random() - 0.5);
        return shuffled.slice(0, num);
      };
      
      const wrongTypes1 = generateWrongTypes();
      const wrongTypes2 = generateWrongTypes();

      const typeOptions = [
        correct.types,
        wrongTypes1,
        wrongTypes2
      ].sort(() => Math.random() - 0.5);

      const h = correct.height / 10;
      const correctHeightOption = `${Math.max(0, h - 0.5).toFixed(1)}m - ${(h + 0.5).toFixed(1)}m`;
      const heightOptions = [
        correctHeightOption,
        `${(h + 0.6).toFixed(1)}m - ${(h + 1.5).toFixed(1)}m`,
        `${(Math.max(0, h - 1.5)).toFixed(1)}m - ${(Math.max(0, h - 0.6)).toFixed(1)}m`
      ].sort(() => Math.random() - 0.5);

      setQuizData({
        pokemon: correct,
        nameOptions,
        typeOptions,
        heightOptions,
        correctName: correct.name,
        correctTypes: correct.types,
        correctHeightOption
      });

    } catch (e) {
      setSelectedPokemonId(null);
      setMessage({ type: 'error', title: "Error", desc: "Failed to start encounter." });
      setTimeout(() => setMessage(null), 2000);
    } finally {
      setQuizLoading(false);
    }
  };

  const handleAnswer = (isCorrect: boolean) => {
    const newAnswers = [...answers, isCorrect];
    setAnswers(newAnswers);
    
    if (quizStep < 2) {
      setQuizStep(prev => prev + 1);
    } else {
      // Finished quiz
      const correctCount = newAnswers.filter(Boolean).length;
      if (correctCount >= 2) {
        // Proceed to catch
        playPokemonCry(selectedPokemonId!);
        finalizeCatch(selectedPokemonId!);
      } else {
        // Failed
        const id = selectedPokemonId!;
        setSelectedPokemonId(null);
        setFleeingPokemons(prev => [...prev, id]);
        setActivePokemons(prev => prev.filter(p => p !== id));
        
        setMessage({
          type: "error",
          title: "Oh no!",
          desc: "The wild Pokémon broke free and ran away!"
        });
        setTimeout(() => setMessage(null), 3000);
      }
    }
  };

  const finalizeCatch = (id: number) => {
    const todayStr = new Date().toDateString();
    
    // Remove from active but don't clear the field
    setActivePokemons(prev => prev.filter(p => p !== id));
    setHasCaughtToday(true);
    
    // Add to caught
    const newCaught = [...caughtPokemons, id];
    const uniqueCaught = Array.from(new Set(newCaught));
    
    setCaughtPokemons(uniqueCaught);
    localStorage.setItem("caughtPokemons", JSON.stringify(uniqueCaught));
    localStorage.setItem("lastCaughtDate", todayStr);
    
    setSelectedPokemonId(null);

    // Briefly open bag to show new catch
    setIsBagOpen(true);

    setMessage({
      type: "success",
      title: "Gotcha!",
      desc: `You caught the wild Pokémon!`
    });
    setTimeout(() => setMessage(null), 3000);
  };

  const renderMessage = () => {
    if (!message) return null;
    return (
      <div className="absolute top-4 left-1/2 -translate-x-1/2 z-50 pointer-events-none">
        <div className={`flex items-center gap-3 border rounded-lg px-4 py-3 transition-all animate-in fade-in slide-in-from-top-4 zoom-in-95 duration-300 pointer-events-auto shadow-md ${message.type === 'success' ? 'bg-green-50 border-green-200 text-green-800' : 'bg-red-50 border-red-200 text-red-800'}`}>
          {message.type === 'success' ? <CheckCircle className="text-green-500 shrink-0" /> : <XCircle className="text-red-500 shrink-0" />}
          <div className="flex flex-col text-left">
            <span className="font-semibold">{message.title}</span>
            {message.desc && <span className="text-sm">{message.desc}</span>}
          </div>
        </div>
      </div>
    );
  };

  if (!isLoaded) return null;

  return (
    <div className="relative w-full h-[calc(100dvh-200px)] rounded-3xl border border-border/50 overflow-hidden shadow-inner bg-sky-200 dark:bg-sky-950">
      {/* Scenery layers */}
      <div className="absolute inset-0">
          {/* Sky Gradient */}
          <div className="absolute inset-x-0 top-0 h-[45%] bg-gradient-to-b from-sky-400 to-sky-200 dark:from-indigo-950 dark:to-sky-900" />
          
          {/* Clouds */}
          <div className="absolute top-[10%] left-[20%] w-24 h-8 bg-white/60 dark:bg-white/10 rounded-full blur-[2px]" />
          <div className="absolute top-[25%] left-[70%] w-32 h-10 bg-white/50 dark:bg-white/5 rounded-full blur-[2px]" />
          <div className="absolute top-[15%] left-[85%] w-16 h-6 bg-white/40 dark:bg-white/5 rounded-full blur-[2px]" />
          
          {/* Mountains/Hills in the distance */}
          <div className="absolute inset-x-0 top-[30%] h-[15%]">
            <svg viewBox="0 0 100 100" preserveAspectRatio="none" className="w-full h-full text-green-700/40 dark:text-emerald-900/40" fill="currentColor">
              <path d="M0,100 L0,80 Q25,20 50,80 T100,60 L100,100 Z" />
            </svg>
          </div>
          
          {/* Grass Gradient */}
          <div className="absolute inset-x-0 top-[40%] h-[40%] bg-gradient-to-b from-green-400 to-green-600 dark:from-emerald-900 dark:to-emerald-950">
            {/* Field Pattern */}
            <div className="absolute inset-0 opacity-10" style={{
              backgroundImage: 'radial-gradient(circle at 2px 2px, rgba(0,0,0,0.4) 1px, transparent 0)',
              backgroundSize: '32px 32px'
            }} />
          </div>

          {/* Water/Lake Gradient */}
          <div className="absolute inset-x-0 bottom-0 h-[25%] bg-gradient-to-b from-blue-400 to-blue-600 dark:from-blue-900 dark:to-blue-950 overflow-hidden">
            {/* Water ripples */}
            <div className="absolute inset-0 opacity-20 flex flex-col justify-around">
              <div className="w-full h-1 bg-white/50 rounded-full blur-[1px] transform -translate-x-4"></div>
              <div className="w-full h-1 bg-white/50 rounded-full blur-[1px] transform translate-x-8"></div>
              <div className="w-full h-1 bg-white/50 rounded-full blur-[1px] transform translate-x-2"></div>
            </div>
            
            {/* Shoreline Transition */}
            <div className="absolute top-0 inset-x-0 h-3 bg-gradient-to-b from-yellow-600/30 to-transparent"></div>
          </div>
        </div>

        {renderMessage()}

        <div className="absolute inset-4 flex items-center justify-center pointer-events-none text-xl font-bold text-black/30 dark:text-white/30 uppercase tracking-widest text-center z-0">
          {hasCaughtToday ? "You have already caught a Pokémon today! Come back tomorrow." : (activePokemons.length > 0 ? "Wild Pokemon appeared!" : "The field is empty...")}
        </div>

        <div className="absolute inset-0 z-10">
          <AnimatePresence>
            {activePokemons.map(id => (
              <RoamingPokemon key={id} id={id} onClick={handlePokemonClick} isFleeing={false} isFlying={pokemonTypesMap[id]?.isFlying} isWater={pokemonTypesMap[id]?.isWater} />
            ))}
            {fleeingPokemons.map(id => (
              <RoamingPokemon key={`flee-${id}`} id={id} onClick={() => {}} isFleeing={true} isFlying={pokemonTypesMap[id]?.isFlying} isWater={pokemonTypesMap[id]?.isWater} />
            ))}
          </AnimatePresence>
        </div>

      {/* Bag Toggle Button */}
      <Button 
        onClick={() => setIsBagOpen(!isBagOpen)}
        className="absolute bottom-4 right-4 rounded-full px-6 py-6 shadow-2xl z-40 bg-white dark:bg-slate-900 border-border/50 hover:bg-muted text-foreground font-bold"
        variant="outline"
      >
        🎒 My Pokémon ({caughtPokemons.length})
      </Button>

      {/* Bag Overlay */}
      <AnimatePresence>
        {isBagOpen && (
          <motion.div
            initial={{ y: 200, opacity: 0, scale: 0.9 }}
            animate={{ y: 0, opacity: 1, scale: 1 }}
            exit={{ y: 200, opacity: 0, scale: 0.9 }}
            className="absolute bottom-20 right-4 w-[350px] max-w-[calc(100vw-32px)] max-h-[60%] bg-background/95 backdrop-blur-xl border border-border/50 rounded-3xl shadow-2xl z-40 flex flex-col p-4 overflow-hidden"
          >
            <div className="flex justify-between items-center mb-3 px-2">
              <h3 className="font-bold text-lg">My Pokémon</h3>
              <Button variant="ghost" size="icon" className="h-8 w-8 rounded-full text-muted-foreground hover:text-foreground" onClick={() => setIsBagOpen(false)}>
                <XCircle className="h-5 w-5" />
              </Button>
            </div>
            <div className="flex-1 overflow-y-auto custom-scrollbar p-1">
              {caughtPokemons.length === 0 ? (
                <div className="h-full min-h-32 flex items-center justify-center text-muted-foreground text-sm opacity-70">
                  Your bag is empty. Catch some Pokémon!
                </div>
              ) : (
                <div className="flex flex-wrap gap-2">
                  {caughtPokemons.map(id => (
                    <Link 
                      href={`/pokemons/${getPokemonGen(id)}/${id}`}
                      key={id} 
                      className="relative w-14 h-14 bg-muted/30 rounded-xl flex items-center justify-center border border-border/50 hover:bg-muted/50 transition-colors hover:scale-105 active:scale-95"
                    >
                      <PokemonImage pokemonId={id} alt={`Caught ${id}`} imageSize={80} className="w-12 h-12 object-contain" />
                    </Link>
                  ))}
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Quiz Modal */}
      <Dialog open={selectedPokemonId !== null} onOpenChange={(open) => {
        if (!open) {
          setSelectedPokemonId(null);
        }
      }}>
        <DialogContent className="sm:max-w-[425px] overflow-hidden">
          {quizLoading ? (
            <div className="flex flex-col items-center justify-center py-12 gap-4">
              <Loader2 className="w-8 h-8 animate-spin text-primary" />
              <p className="text-muted-foreground animate-pulse">A wild Pokémon appeared!</p>
            </div>
          ) : quizData ? (
            <>
              <DialogHeader>
                <DialogTitle>Wild Encounter!</DialogTitle>
                <DialogDescription>
                  Answer correctly to catch it! ({answers.filter(Boolean).length}/2 required)
                </DialogDescription>
              </DialogHeader>
              
              <div className="flex flex-col items-center gap-6 py-4">
                <div className="relative w-32 h-32 flex items-center justify-center">
                  <div className="absolute inset-0 bg-blue-100 dark:bg-blue-900/40 rounded-full blur-xl" />
                  <PokemonImage pokemonId={selectedPokemonId!} alt="Encounter" imageSize={140} className="opacity-100 drop-shadow-lg w-28 h-28 object-contain" />
                </div>

                <div className="w-full space-y-3">
                  <h4 className="font-semibold text-center text-lg">
                    {quizStep === 0 && "What is this Pokémon's name?"}
                    {quizStep === 1 && "What are its types?"}
                    {quizStep === 2 && "What is its approximate height?"}
                  </h4>
                  
                  <div className="grid gap-2">
                    {quizStep === 0 && quizData.nameOptions.map((opt: string, i: number) => (
                      <Button key={i} variant="outline" className="w-full capitalize justify-start h-auto py-3" onClick={() => handleAnswer(opt === quizData.correctName)}>
                        {opt}
                      </Button>
                    ))}
                    
                    {quizStep === 1 && quizData.typeOptions.map((opt: string[], i: number) => (
                      <Button key={i} variant="outline" className="w-full capitalize justify-start h-auto py-3" onClick={() => handleAnswer(opt.join(',') === quizData.correctTypes.join(','))}>
                        {opt.join(' / ')}
                      </Button>
                    ))}
                    
                    {quizStep === 2 && quizData.heightOptions.map((opt: string, i: number) => (
                      <Button key={i} variant="outline" className="w-full justify-start h-auto py-3" onClick={() => handleAnswer(opt === quizData.correctHeightOption)}>
                        {opt}
                      </Button>
                    ))}
                  </div>
                </div>
                
                <div className="flex gap-2 w-full justify-center">
                  {[0, 1, 2].map(step => (
                    <div key={step} className={`h-2 flex-1 rounded-full ${
                      step < quizStep ? (answers[step] ? 'bg-green-500' : 'bg-red-500') 
                      : step === quizStep ? 'bg-primary animate-pulse' 
                      : 'bg-muted'
                    }`} />
                  ))}
                </div>
              </div>
            </>
          ) : null}
        </DialogContent>
      </Dialog>
    </div>
  );
}
