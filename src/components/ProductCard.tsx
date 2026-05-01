/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { MessageCircle, MapPin, Tag } from 'lucide-react';
import { motion } from 'motion/react';
import { Product } from '../types';
import { COLORS } from '../constants';

interface ProductCardProps {
  product: Product;
  key?: string | number;
}

export default function ProductCard({ product }: ProductCardProps) {
  const handleWhatsAppClick = () => {
    const message = `Hi, I'm interested in your ${product.name} (Price: $${product.price}) listed on HustleLink. Is it still available?`;
    window.open(`https://wa.me/${product.sellerWhatsApp}?text=${encodeURIComponent(message)}`, '_blank');
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      whileHover={{ scale: 1.02 }}
      className="card-3d glass rounded-[32px] overflow-hidden relative group"
    >
      {product.isSponsored && (
        <div className="absolute top-4 left-4 z-10 bg-accent text-[10px] font-bold uppercase py-1 px-2 rounded-full flex items-center gap-1 glow-orange">
          <Tag className="w-3 h-3" />
          Sponsored
        </div>
      )}

      <div className="aspect-square relative overflow-hidden bg-navy/50">
        <img
          src={product.image}
          alt={product.name}
          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
          referrerPolicy="no-referrer"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-navy/80 to-transparent opacity-60" />
      </div>

      <div className="p-4 space-y-3">
        <div>
          <h3 className="font-semibold text-lg line-clamp-1">{product.name}</h3>
          <p className="text-whatsapp font-bold text-xl">${product.price}</p>
        </div>

        <div className="flex items-center justify-between text-xs text-white/60">
          <div className="flex items-center gap-1">
            <MapPin className="w-3 h-3" />
            {product.location}
          </div>
          <span className="bg-white/10 px-2 py-0.5 rounded-full">{product.category}</span>
        </div>

        <button
          onClick={handleWhatsAppClick}
          className="w-full py-3 bg-whatsapp hover:bg-whatsapp-dark text-navy font-bold rounded-2xl flex items-center justify-center gap-2 transition-all active:scale-95 shadow-lg shadow-whatsapp/20"
          id={`chat-btn-${product.id}`}
        >
          <MessageCircle className="w-5 h-5 fill-current" />
          Chat on WhatsApp
        </button>
      </div>
    </motion.div>
  );
}
