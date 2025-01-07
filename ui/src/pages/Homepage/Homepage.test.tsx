
import Homepage from "./Homepage";
import {describe, expect, test} from 'vitest'
import {render} from '@testing-library/react'

describe('Homepage', () => {
    test('renders the Homepage', () => {
        render(<Homepage />)
        expect('Chirps').toBeDefined()
        expect('Trending').toBeDefined()
        expect('Suggestions').toBeDefined()

    })
})
