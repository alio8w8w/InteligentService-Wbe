import Link from "next/link"
import { recommendedProducts } from "@/lib/catalog"

export function RecommendedProductsSection({ locale }: { locale: string }) {
  return (
    <section id="products" className="bg-[#06141B] py-20 md:py-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between gap-4 flex-wrap">
          <div>
            <p className="text-xs uppercase tracking-[0.2em] text-[#FF4B04]">Produse</p>
            <h2 className="mt-2 text-3xl font-bold text-[#CCD0CF] font-mono">
              Produse recomandate si la reducere
            </h2>
          </div>
          <Link
            href={`/${locale}/produse`}
            className="rounded-xl bg-[#FF4B04] px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-[#FF4B04]/85"
          >
            Vezi mai multe
          </Link>
        </div>

        <div className="mt-10 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {recommendedProducts.slice(0, 3).map((product) => (
            <article
              key={product.id}
              className="rounded-2xl border border-[#253745] bg-[#11212D] p-5"
            >
              <p className="text-xs uppercase tracking-wider text-[#9BABAB]">{product.brand}</p>
              <h3 className="mt-2 text-lg font-semibold text-[#CCD0CF]">{product.name}</h3>
              <p className="mt-2 text-sm text-[#9BABAB]">{product.shortDescription}</p>
              <div className="mt-4 flex items-center gap-2">
                <span className="text-xl font-bold text-[#CCD0CF]">{product.price} EUR</span>
                {product.oldPrice ? (
                  <span className="text-sm text-[#4A5C6A] line-through">{product.oldPrice} EUR</span>
                ) : null}
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  )
}
