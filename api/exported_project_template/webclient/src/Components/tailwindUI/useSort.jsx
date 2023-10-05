const useSort = () => {
    const sortItem = (item) => {
        const sortString = `field=${item.field}&order=${item.sort == 'direct' ? '1' : '-1'}`;
        return sortString
    }
    return sortItem
}

export default useSort;