import { useEffect, useMemo, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
    fetchPagedProducts,
    setPageSize,
    setSortBy,
} from '../features/products/productSlice';

export function useProducts() {
    const dispatch = useDispatch();

    const [searchText, setSearchText] = useState('');
    const [maxPrice, setMaxPrice] = useState('');

    const {
        pagedItems: products,
        loading,
        error,
        currentPage,
        pageSize,
        totalPages,
        totalElements,
        sortBy,
    } = useSelector((state) => state.products);

    useEffect(() => {
        dispatch(fetchPagedProducts({ page: currentPage, size: pageSize, sortBy }));
    }, [dispatch, currentPage, pageSize, sortBy]);

    const filteredProducts = useMemo(() => {
        return products.filter((product) => {
            const matchesName = product.name
                .toLowerCase()
                .includes(searchText.toLowerCase());

            const matchesPrice =
                maxPrice === '' || product.price <= Number(maxPrice);

            return matchesName && matchesPrice;
        });
    }, [products, searchText, maxPrice]);

    const handleClearFilters = () => {
        setSearchText('');
        setMaxPrice('');
    };

    const handlePreviousPage = () => {
        if (currentPage > 0) {
            dispatch(
                fetchPagedProducts({
                    page: currentPage - 1,
                    size: pageSize,
                    sortBy,
                })
            );
        }
    };

    const handleNextPage = () => {
        if (currentPage < totalPages - 1) {
            dispatch(
                fetchPagedProducts({
                    page: currentPage + 1,
                    size: pageSize,
                    sortBy,
                })
            );
        }
    };

    const handlePageClick = (pageNumber) => {
        dispatch(
            fetchPagedProducts({
                page: pageNumber,
                size: pageSize,
                sortBy,
            })
        );
    };

    const handlePageSizeChange = (event) => {
        const newSize = Number(event.target.value);
        dispatch(setPageSize(newSize));
        dispatch(fetchPagedProducts({ page: 0, size: newSize, sortBy }));
    };

    const handleSortChange = (event) => {
        const newSortBy = event.target.value;
        dispatch(setSortBy(newSortBy));
        dispatch(fetchPagedProducts({ page: 0, size: pageSize, sortBy: newSortBy }));
    };

    return {
        products,
        filteredProducts,
        loading,
        error,
        currentPage,
        pageSize,
        totalPages,
        totalElements,
        sortBy,
        searchText,
        maxPrice,
        setSearchText,
        setMaxPrice,
        handleClearFilters,
        handlePreviousPage,
        handleNextPage,
        handlePageClick,
        handlePageSizeChange,
        handleSortChange,
    };
}