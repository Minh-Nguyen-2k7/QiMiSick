import { useState, useContext, createContext } from "react";

interface FilterContextType {
    searchQuery: string
    setSearchQuery: (query: string) => void
}

const FilterContext = createContext<FilterContextType | undefined>(undefined)

export const FilterProvider = ({ children }: { children: React.ReactNode }) => {
    const [searchQuery, setSearchQuery] = useState<string>("")


    return <FilterContext.Provider value={{ searchQuery, setSearchQuery }}>
        {children}
    </FilterContext.Provider>
}

export const useFilter = () => {
    const context = useContext(FilterContext)
    if (!context) {
        throw new Error("Component use useFilter must be wrapped in FilterProvider")
    }
    return context
}