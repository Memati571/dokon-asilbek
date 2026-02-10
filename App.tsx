
import React, { useState, useEffect, useMemo } from 'react';
import { 
  Search, 
  ShoppingBag, 
  Clock, 
  Star, 
  MapPin, 
  ChevronRight, 
  ArrowLeft,
  Plus,
  Minus,
  Navigation,
  Sparkles,
  UtensilsCrossed,
  Truck,
  Package
} from 'lucide-react';
import { Restaurant, MenuItem, CartItem, Order, OrderStatus } from './types';
import { RESTAURANTS, MENU_ITEMS } from './mockData';
import { getAIFoodRecommendation } from './geminiService';

const App: React.FC = () => {
  const [activeView, setActiveView] = useState<'home' | 'restaurant' | 'cart' | 'tracking' | 'profile'>('home');
  const [selectedRestaurant, setSelectedRestaurant] = useState<Restaurant | null>(null);
  const [cart, setCart] = useState<CartItem[]>([]);
  const [activeOrder, setActiveOrder] = useState<Order | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [aiMood, setAiMood] = useState('');
  const [aiSuggestions, setAiSuggestions] = useState<{itemName: string, reason: string}[]>([]);
  const [isAiLoading, setIsAiLoading] = useState(false);

  const filteredRestaurants = useMemo(() => {
    return RESTAURANTS.filter(r => 
      r.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
      r.cuisine.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [searchQuery]);

  const cartTotal = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  const deliveryFee = selectedRestaurant?.deliveryFee || 0;

  const addToCart = (item: MenuItem) => {
    setCart(prev => {
      const existing = prev.find(i => i.id === item.id);
      if (existing) {
        return prev.map(i => i.id === item.id ? { ...i, quantity: i.quantity + 1 } : i);
      }
      return [...prev, { ...item, quantity: 1 }];
    });
  };

  const removeFromCart = (itemId: string) => {
    setCart(prev => {
      const existing = prev.find(i => i.id === itemId);
      if (existing && existing.quantity > 1) {
        return prev.map(i => i.id === itemId ? { ...i, quantity: i.quantity - 1 } : i);
      }
      return prev.filter(i => i.id !== itemId);
    });
  };

  const handlePlaceOrder = () => {
    if (!selectedRestaurant) return;
    const newOrder: Order = {
      id: Math.random().toString(36).substr(2, 9),
      userId: 'user1',
      restaurantId: selectedRestaurant.id,
      items: cart.map(item => ({ menuItemId: item.id, name: item.name, quantity: item.quantity, price: item.price })),
      totalAmount: cartTotal + deliveryFee,
      status: 'pending',
      type: 'delivery',
      createdAt: new Date().toISOString()
    };
    setActiveOrder(newOrder);
    setCart([]);
    setActiveView('tracking');
  };

  const handleGetRecommendation = async () => {
    if (!aiMood) return;
    setIsAiLoading(true);
    const result = await getAIFoodRecommendation(aiMood, MENU_ITEMS);
    setAiSuggestions(result.recommendations);
    setIsAiLoading(false);
  };

  // Mock order tracking progress
  useEffect(() => {
    if (activeOrder && activeOrder.status !== 'delivered') {
      const statuses: OrderStatus[] = ['pending', 'preparing', 'on_the_way', 'delivered'];
      const currentIndex = statuses.indexOf(activeOrder.status);
      if (currentIndex < statuses.length - 1) {
        const timer = setTimeout(() => {
          setActiveOrder(prev => prev ? { ...prev, status: statuses[currentIndex + 1] } : null);
        }, 5000); // Progress status every 5 seconds for demo
        return () => clearTimeout(timer);
      }
    }
  }, [activeOrder]);

  return (
    <div className="min-h-screen pb-20">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-white border-b border-gray-100 px-4 py-3 flex items-center justify-between">
        {activeView === 'home' ? (
          <div className="flex flex-col">
            <span className="text-xs text-gray-500 font-medium">Yetkazib berish manzili</span>
            <div className="flex items-center gap-1">
              <MapPin size={16} className="text-orange-500" />
              <span className="text-sm font-bold">Toshkent sh., Yunusobod</span>
            </div>
          </div>
        ) : (
          <button onClick={() => setActiveView('home')} className="p-2 -ml-2 rounded-full hover:bg-gray-100">
            <ArrowLeft size={20} />
          </button>
        )}
        <div className="text-xl font-extrabold text-orange-500 tracking-tight">LAZZAT</div>
        <button onClick={() => setActiveView('cart')} className="relative p-2 rounded-full hover:bg-gray-100">
          <ShoppingBag size={22} />
          {cart.length > 0 && (
            <span className="absolute top-1 right-1 bg-orange-600 text-white text-[10px] font-bold w-4 h-4 rounded-full flex items-center justify-center">
              {cart.length}
            </span>
          )}
        </button>
      </header>

      <main className="max-w-4xl mx-auto p-4">
        {activeView === 'home' && (
          <section className="space-y-6">
            {/* AI Assistant Card */}
            <div className="bg-gradient-to-r from-orange-500 to-orange-600 rounded-2xl p-5 text-white shadow-lg shadow-orange-200">
              <div className="flex items-center gap-2 mb-3">
                <Sparkles size={20} className="text-yellow-300" />
                <h2 className="font-bold text-lg">AI Tanlovchi</h2>
              </div>
              <p className="text-sm text-orange-50 mb-4">Kayfiyatingizga qarab taom tanlashga qiynalyapsizmi?</p>
              <div className="flex gap-2">
                <input 
                  type="text" 
                  placeholder="Masalan: Achchiq va yengil narsa..."
                  className="flex-1 px-4 py-2 rounded-xl text-gray-800 text-sm focus:outline-none"
                  value={aiMood}
                  onChange={(e) => setAiMood(e.target.value)}
                />
                <button 
                  onClick={handleGetRecommendation}
                  disabled={isAiLoading}
                  className="bg-white text-orange-600 px-4 py-2 rounded-xl text-sm font-bold hover:bg-orange-50 transition-colors"
                >
                  {isAiLoading ? '...' : 'Topish'}
                </button>
              </div>
              {aiSuggestions.length > 0 && (
                <div className="mt-4 space-y-2 bg-white/10 p-3 rounded-xl backdrop-blur-sm">
                  {aiSuggestions.map((s, idx) => (
                    <div key={idx} className="text-sm border-b border-white/20 last:border-0 pb-2 last:pb-0 pt-2 first:pt-0">
                      <span className="font-bold">✨ {s.itemName}:</span> {s.reason}
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Search Bar */}
            <div className="relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
              <input 
                type="text" 
                placeholder="Restoran yoki taom qidirish..."
                className="w-full pl-11 pr-4 py-3 bg-gray-100 rounded-2xl text-sm focus:bg-white focus:ring-2 focus:ring-orange-100 transition-all outline-none"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>

            {/* Restaurants List */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="font-bold text-lg">Barcha restoranlar</h3>
                <span className="text-orange-500 text-xs font-bold uppercase tracking-wider">Filtrlash</span>
              </div>
              {filteredRestaurants.map(restaurant => (
                <div 
                  key={restaurant.id} 
                  className="bg-white rounded-2xl overflow-hidden shadow-sm border border-gray-100 cursor-pointer transition-transform active:scale-[0.98]"
                  onClick={() => {
                    setSelectedRestaurant(restaurant);
                    setActiveView('restaurant');
                  }}
                >
                  <div className="h-40 relative">
                    <img src={restaurant.image} alt={restaurant.name} className="w-full h-full object-cover" />
                    <div className="absolute top-3 right-3 bg-white/90 backdrop-blur px-2 py-1 rounded-lg text-xs font-bold flex items-center gap-1">
                      <Star size={12} className="text-yellow-500 fill-yellow-500" />
                      {restaurant.rating}
                    </div>
                  </div>
                  <div className="p-4">
                    <div className="flex justify-between items-start mb-1">
                      <h4 className="font-bold text-gray-900">{restaurant.name}</h4>
                      <span className="text-xs font-medium text-gray-500">{restaurant.deliveryTime}</span>
                    </div>
                    <p className="text-sm text-gray-500 mb-3">{restaurant.cuisine}</p>
                    <div className="flex items-center gap-3 text-xs text-gray-400">
                      <div className="flex items-center gap-1">
                        <Truck size={14} />
                        {restaurant.deliveryFee.toLocaleString()} so'm
                      </div>
                      <div className="w-1 h-1 rounded-full bg-gray-300"></div>
                      <div className="flex items-center gap-1">
                        <MapPin size={14} />
                        {restaurant.address.split(',')[0]}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}

        {activeView === 'restaurant' && selectedRestaurant && (
          <section className="space-y-6">
            <div className="h-56 -mx-4 -mt-4 relative">
              <img src={selectedRestaurant.image} className="w-full h-full object-cover" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
              <div className="absolute bottom-6 left-6 text-white">
                <h2 className="text-2xl font-bold mb-1">{selectedRestaurant.name}</h2>
                <div className="flex items-center gap-2 text-sm text-white/80">
                  <Star size={14} className="text-yellow-400 fill-yellow-400" />
                  <span>{selectedRestaurant.rating} (500+)</span>
                  <span>•</span>
                  <span>{selectedRestaurant.cuisine}</span>
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <h3 className="font-bold text-lg">Menyu</h3>
              <div className="grid grid-cols-1 gap-4">
                {MENU_ITEMS.filter(item => item.restaurantId === selectedRestaurant.id).map(item => (
                  <div key={item.id} className="flex gap-4 p-3 bg-white rounded-2xl border border-gray-100 shadow-sm">
                    <img src={item.image} className="w-24 h-24 rounded-xl object-cover" />
                    <div className="flex-1 flex flex-col">
                      <h5 className="font-bold text-sm mb-1">{item.name}</h5>
                      <p className="text-xs text-gray-500 line-clamp-2 mb-auto">{item.description}</p>
                      <div className="flex items-center justify-between mt-2">
                        <span className="font-bold text-orange-600 text-sm">{item.price.toLocaleString()} so'm</span>
                        <button 
                          onClick={() => addToCart(item)}
                          className="bg-orange-100 text-orange-600 p-1.5 rounded-lg hover:bg-orange-200 transition-colors"
                        >
                          <Plus size={18} />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </section>
        )}

        {activeView === 'cart' && (
          <section className="space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-bold">Savatcha</h2>
              <button onClick={() => setCart([])} className="text-red-500 text-sm font-medium">Tozalash</button>
            </div>

            {cart.length === 0 ? (
              <div className="py-20 flex flex-col items-center text-gray-400">
                <ShoppingBag size={64} className="mb-4 opacity-20" />
                <p>Savatchangiz hozircha bo'sh</p>
                <button 
                  onClick={() => setActiveView('home')}
                  className="mt-6 text-orange-500 font-bold"
                >
                  Buyurtma berishni boshlang
                </button>
              </div>
            ) : (
              <div className="space-y-4">
                <div className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100 space-y-4">
                  {cart.map(item => (
                    <div key={item.id} className="flex items-center gap-4">
                      <img src={item.image} className="w-16 h-16 rounded-xl object-cover" />
                      <div className="flex-1">
                        <h6 className="font-bold text-sm">{item.name}</h6>
                        <p className="text-xs text-gray-400">{item.price.toLocaleString()} so'm</p>
                      </div>
                      <div className="flex items-center gap-3">
                        <button onClick={() => removeFromCart(item.id)} className="p-1 rounded-md bg-gray-100"><Minus size={14}/></button>
                        <span className="text-sm font-bold w-4 text-center">{item.quantity}</span>
                        <button onClick={() => addToCart(item)} className="p-1 rounded-md bg-gray-100"><Plus size={14}/></button>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100 space-y-3">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-500">Taomlar narxi</span>
                    <span className="font-medium">{cartTotal.toLocaleString()} so'm</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-500">Yetkazib berish</span>
                    <span className="font-medium">{deliveryFee.toLocaleString()} so'm</span>
                  </div>
                  <div className="pt-3 border-t border-gray-100 flex justify-between items-center">
                    <span className="font-bold">Jami:</span>
                    <span className="text-xl font-bold text-orange-600">{(cartTotal + deliveryFee).toLocaleString()} so'm</span>
                  </div>
                </div>

                <div className="bg-orange-50 border border-orange-100 p-4 rounded-2xl flex items-center gap-3 text-sm text-orange-700">
                  <Clock size={18} />
                  <span>Yetkazib berish taxminan 30-40 daqiqa davom etadi</span>
                </div>

                <button 
                  onClick={handlePlaceOrder}
                  className="w-full bg-orange-500 text-white py-4 rounded-2xl font-bold text-lg shadow-lg shadow-orange-100 hover:bg-orange-600 transition-all active:scale-[0.98]"
                >
                  Buyurtma berish
                </button>
              </div>
            )}
          </section>
        )}

        {activeView === 'tracking' && activeOrder && (
          <section className="space-y-8 py-4">
            <div className="text-center space-y-2">
              <h2 className="text-2xl font-bold">Buyurtmangiz yo'lda!</h2>
              <p className="text-gray-500 text-sm">Buyurtma #LZZ-{activeOrder.id.toUpperCase()}</p>
            </div>

            {/* Tracking Status UI */}
            <div className="bg-white rounded-3xl p-6 shadow-sm border border-gray-100">
              <div className="relative space-y-10">
                {/* Connector Line */}
                <div className="absolute left-[15px] top-4 bottom-4 w-0.5 bg-gray-100">
                  <div 
                    className="absolute top-0 w-full bg-orange-500 transition-all duration-1000"
                    style={{ 
                      height: activeOrder.status === 'pending' ? '0%' : 
                              activeOrder.status === 'preparing' ? '33%' : 
                              activeOrder.status === 'on_the_way' ? '66%' : '100%' 
                    }}
                  />
                </div>

                <div className="flex items-center gap-4 relative">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center z-10 ${activeOrder.status !== 'pending' ? 'bg-orange-500 text-white' : 'bg-gray-100 text-gray-400 border-2 border-white'}`}>
                    <Package size={16} />
                  </div>
                  <div>
                    <p className={`font-bold text-sm ${activeOrder.status === 'pending' ? 'text-gray-900' : 'text-gray-400'}`}>Buyurtma qabul qilindi</p>
                    <p className="text-xs text-gray-400">14:30 da</p>
                  </div>
                </div>

                <div className="flex items-center gap-4 relative">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center z-10 ${['preparing', 'on_the_way', 'delivered'].includes(activeOrder.status) ? 'bg-orange-500 text-white' : 'bg-gray-100 text-gray-400 border-2 border-white'}`}>
                    <UtensilsCrossed size={16} />
                  </div>
                  <div>
                    <p className={`font-bold text-sm ${activeOrder.status === 'preparing' ? 'text-gray-900' : 'text-gray-400'}`}>Tayyorlanmoqda</p>
                    <p className="text-xs text-gray-400">Oshpazlar ishlamoqda</p>
                  </div>
                </div>

                <div className="flex items-center gap-4 relative">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center z-10 ${['on_the_way', 'delivered'].includes(activeOrder.status) ? 'bg-orange-500 text-white' : 'bg-gray-100 text-gray-400 border-2 border-white'}`}>
                    <Truck size={16} />
                  </div>
                  <div>
                    <p className={`font-bold text-sm ${activeOrder.status === 'on_the_way' ? 'text-gray-900' : 'text-gray-400'}`}>Kuryer yo'lda</p>
                    <p className="text-xs text-gray-400">Murod ismli kuryer</p>
                  </div>
                </div>

                <div className="flex items-center gap-4 relative">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center z-10 ${activeOrder.status === 'delivered' ? 'bg-green-500 text-white' : 'bg-gray-100 text-gray-400 border-2 border-white'}`}>
                    <Navigation size={16} />
                  </div>
                  <div>
                    <p className={`font-bold text-sm ${activeOrder.status === 'delivered' ? 'text-gray-900' : 'text-gray-400'}`}>Yetkazib berildi</p>
                    <p className="text-xs text-gray-400">Yoqimli ishtaha!</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-blue-500 rounded-3xl p-6 text-white flex items-center justify-between shadow-lg shadow-blue-100">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-white/20 rounded-2xl flex items-center justify-center">
                  <Truck size={24} />
                </div>
                <div>
                  <p className="font-bold">Murod kuryer</p>
                  <p className="text-xs text-blue-100">Chevrolet Spark • 01 A 123 AA</p>
                </div>
              </div>
              <button className="bg-white text-blue-600 px-4 py-2 rounded-xl text-sm font-bold">Qo'ng'iroq</button>
            </div>
            
            <button 
              onClick={() => setActiveView('home')}
              className="w-full py-4 text-gray-500 font-bold"
            >
              Asosiy sahifaga qaytish
            </button>
          </section>
        )}
      </main>

      {/* Bottom Navigation */}
      <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-100 px-6 py-3 flex justify-between items-center z-50">
        <button 
          onClick={() => setActiveView('home')}
          className={`flex flex-col items-center gap-1 ${activeView === 'home' ? 'text-orange-500' : 'text-gray-400'}`}
        >
          <UtensilsCrossed size={22} />
          <span className="text-[10px] font-bold">Bosh sahifa</span>
        </button>
        <button 
          onClick={() => setActiveView('cart')}
          className={`flex flex-col items-center gap-1 ${activeView === 'cart' ? 'text-orange-500' : 'text-gray-400'}`}
        >
          <ShoppingBag size={22} />
          <span className="text-[10px] font-bold">Savatcha</span>
        </button>
        <button 
          onClick={() => setActiveView('tracking')}
          className={`flex flex-col items-center gap-1 ${activeView === 'tracking' ? 'text-orange-500' : 'text-gray-400'}`}
        >
          <Clock size={22} />
          <span className="text-[10px] font-bold">Buyurtmalar</span>
        </button>
        <button 
          onClick={() => setActiveView('profile')}
          className={`flex flex-col items-center gap-1 ${activeView === 'profile' ? 'text-orange-500' : 'text-gray-400'}`}
        >
          <div className="w-6 h-6 rounded-full bg-gray-200 border border-gray-300"></div>
          <span className="text-[10px] font-bold">Profil</span>
        </button>
      </nav>

      {/* Mobile-Friendly Cart Summary Bar (appears when selecting restaurant) */}
      {activeView === 'restaurant' && cart.length > 0 && (
        <div className="fixed bottom-20 left-4 right-4 bg-orange-500 text-white rounded-2xl p-4 flex items-center justify-between shadow-xl animate-bounce">
          <div className="flex items-center gap-3">
            <div className="bg-white/20 px-2 py-1 rounded-lg text-sm font-bold">{cart.length}</div>
            <span className="text-sm font-bold">{cartTotal.toLocaleString()} so'm</span>
          </div>
          <button 
            onClick={() => setActiveView('cart')}
            className="flex items-center gap-1 text-sm font-bold"
          >
            Savatcha <ChevronRight size={18} />
          </button>
        </div>
      )}
    </div>
  );
};

export default App;
