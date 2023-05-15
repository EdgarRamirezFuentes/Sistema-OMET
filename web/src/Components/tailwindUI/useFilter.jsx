const useFilter = () => {
    const filterItems = (filters) => {
        const filterItems = filters.map(filter => {
            const options = filter.options.map(option => {
                if(option.checked){
                    return `${option.value}`
                }
            })
            const cleanOptions = options.filter(opt => opt !== undefined);
            const str = cleanOptions.length > 0 ? `${filter.value}~${cleanOptions.map(item => item).join('|')}` : ''
            return str
        });
        const filteredItems = filterItems.filter(filter => filter !== '');
        const filterString = filterItems.every(filter => filter === '') ?  '' : ` AND ${filteredItems.map(item => item).join(' AND ')}`;
        return filterString
    }
    return filterItems
}

export default useFilter