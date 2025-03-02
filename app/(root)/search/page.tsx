import Pagination from "@/components/shared/pagination";
import ProductCard from "@/components/shared/product/product-card";
import { Button } from "@/components/ui/button";
import { getAllProducts, getAllCategories } from "@/lib/actions/product.actions";
import Link from "next/link";
import { StarIcon } from "lucide-react";





export async function generateMetadata(props: {
    searchParams: Promise<{
        q: string;
        category: string;
        price: string;
        rating: string;
    }>;
}) {
    const {
        q = 'all',
        category = 'all',
        price = 'all',
        rating = 'all',
    } = await props.searchParams;

    const isQuerySet = q && q !== 'all' && q.trim() !== '';
    const isCategorySet = category && category !== 'all' && category.trim() !== '';
    const isPriceSet = price && price !== 'all' && price.trim() !== '';
    const isRatingSet = rating && rating !== 'all' && rating.trim() !== '';

    if (isQuerySet || isCategorySet || isPriceSet || isRatingSet) {
        return {
            title: `Search ${isQuerySet ? q : ''
                }
        ${isCategorySet ? `: Category ${category}` : ''}
        ${isPriceSet ? `: Price ${price}` : ''}
        ${isRatingSet ? `: Rating ${rating}` : ''}`,
        };
    } else {
        return {
            title: 'Search Products',
        };
    }
}

const SearchPage = async (props: {
    searchParams: Promise<{
        q?: string;
        category?: string;
        price?: string;
        rating?: string;
        sort?: string;
        page?: string;
    }>
}) => {
    const { q = 'all',
        category = 'all',
        price = 'all',
        rating = 'all',
        sort = 'newest',
        page = '1'
    } = await props.searchParams;

    // Get Filter URL
    const getFilterUrl = ({
        c,
        s,
        p,
        r,
        pg,
    }: {
        c?: string;
        s?: string;
        p?: string;
        r?: string;
        pg?: string;
    }) => {
        const params = { q, category, price, rating, sort, page };
        if (c) params.category = c;
        if (p) params.price = p;
        if (r) params.rating = r;
        if (pg) params.page = pg;
        if (s) params.sort = s;
        return `/search?${new URLSearchParams(params).toString()}`;
    };

    const categories = await getAllCategories();
    //Create a Price Array
    const prices = [
        {
            name: '$1 to $50',
            value: '1-50',
        },
        {
            name: '$51 to $100',
            value: '51-100',
        },
        {
            name: '$101 to $200',
            value: '101-200',
        },
        // {
        //     name: '$201 to $500',
        //     value: '201-500',
        // },
        // {
        //     name: '$501 to $1000',
        //     value: '501-1000',
        // },
    ];
    const ratings = [4, 3, 2, 1];
    const sortOrders = ['newest', 'lowest', 'highest', 'rating'];


    const products = await getAllProducts({ query: q, category, price, rating, sort, page: Number(page) });
    //console.log('Products', products)
    return (<>

        <div className="grid md:grid-cols-5 md:gap-5">
            <div className="filter-links">
                {/* Category-Links*/}
                <h1 className="text-xl mb-4 mt-3">Sort</h1>
                <div className="text-xl mb-4 mt-3">
                    Categories
                </div>
                <div>
                    <ul className='space-y-1'>
                        <li>
                            <Link className={`${('all' === category || '' === category) && 'font-bold'}`}
                                href={getFilterUrl({ c: 'all' })}
                            >
                                Any
                            </Link>
                        </li>
                        {categories.map((x) => (
                            <li key={x.category}>
                                <Link
                                    className={`${x.category === category && 'font-bold'}`}
                                    href={getFilterUrl({ c: x.category })}
                                >
                                    {x.category}
                                </Link>
                            </li>
                        ))}
                    </ul>
                </div>
                <div>
                    <div className='text-xl mt-8 mb-2'>Price</div>
                    <ul className='space-y-1'>
                        <li>
                            <Link
                                className={`  ${'all' === price && 'font-bold'}`}
                                href={getFilterUrl({ p: 'all' })}
                            >
                                Any
                            </Link>
                        </li>
                        {prices.map((p) => (
                            <li key={p.value}>
                                <Link
                                    href={getFilterUrl({ p: p.value })}
                                    className={`${p.value === price && 'font-bold'}`}
                                >
                                    {p.name}
                                </Link>
                            </li>
                        ))}
                    </ul>
                </div>
                <div>
                    <div className='text-xl mt-8 mb-2'>Customer Review</div>
                    <ul className='space-y-1'>
                        <li>
                            <Link
                                href={getFilterUrl({ r: 'all' })}
                                className={`  ${'all' === rating && 'font-bold'}`}
                            >
                                Any
                            </Link>
                        </li>
                        {ratings.map((r) => (
                            <li key={r} className="flex items-center gap-1">
                                <Link
                                    href={getFilterUrl({ r: `${r}` })}
                                    className={`flex items-center gap-1 ${r.toString() === rating ? 'text-yellow-500' : 'text-yellow-500'
                                        }`}
                                >
                                    {/* Render star icons */}
                                    {[...Array(r)].map((_, i) => (
                                        <StarIcon key={i} className="w-4 h-4" fill="currentColor"
                                            stroke="currentColor" />
                                    ))}
                                    {/* <span className="ml-1 text-sm">& up</span> */}
                                </Link>
                            </li>
                        ))}
                    </ul>
                </div>

            </div>
            <div className="space-y-4 md:col-span-4">
                <div className='flex-between flex-col md:flex-row my-4'>
                    <div className='flex items-center'>
                        {q !== 'all' && q !== '' && 'Search : ' + q + '.'}
                        {category !== 'all' && category !== '' && '   Category : ' + category + '.'}
                        {price !== 'all' && '    Price: ' + price + '.'}
                        {rating !== 'all' && '    Rating: ' + rating + ' & up' + '.'}
                        &nbsp;
                        {(q !== 'all' && q !== '') ||
                            (category !== 'all' && category !== '') ||
                            rating !== 'all' ||
                            price !== 'all' ? (
                            <Button variant={'link'} asChild>
                                <Link href='/search'>Clear</Link>
                            </Button>
                        ) : null}
                    </div>
                    <div>
                        Sort by{' '}
                        {sortOrders.map((s) => (
                            <Link
                                key={s}
                                className={`mx-2   ${sort == s && 'font-bold'} `}
                                href={getFilterUrl({ s })}
                            >
                                {s}
                            </Link>
                        ))}
                    </div>
                </div>


                <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
                    {products.data.length === 0 && (<div className="flex justify-center items-center h-[100%] md:ml-40">
                        <div className="text-center">
                            <p>No Products Found</p>
                            <Button variant="outline" className="mt-4">
                                <Link href="/search">Go Back</Link>
                            </Button>
                        </div>
                    </div>)}
                    {products.data.map((product) => (
                        <ProductCard key={product.id} product={{
                            ...product,
                            costPrice: Number(product.costPrice),
                            discountRate: Number(product.discountRate),
                            isDiscounted: product.isDiscounted,
                            price: Number(product.price),
                            rating: Number(product.rating), // Convert rating to number
                        }} />

                        // </ProductCard>
                    ))}
                    {products!.totalPages! > 1 && (
                        <Pagination page={Number(page)} totalPages={products!.totalPages} />
                    )}
                </div>
            </div>

        </div>
    </>);
}

export default SearchPage;