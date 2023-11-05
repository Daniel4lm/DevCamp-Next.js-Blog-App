/* eslint-disable testing-library/await-async-events */
import { QueryClient } from '@tanstack/query-core';
import '@testing-library/jest-dom'
import { render, screen, waitFor, waitForElementToBeRemoved, renderHook } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { QueryClientProvider } from '@tanstack/react-query';
import { ReactElement } from 'react';
import { useSession } from "next-auth/react"
import { User as SessionUser } from 'next-auth'
import ReactQueryProvider from '@/lib/reactQuery/reactQueryProvider';
import { renderWithClient } from '@/mocks/mswHandlers';
import { useRouter } from "next/navigation"
import UserInfo from '../[username]/components/UserInfo';
import { User } from '@/models/User';

function setup(jsx: ReactElement) {
    return {
        user: userEvent.setup(),
        ...render(jsx),
    };
}

const testQueryClient = new QueryClient({
    defaultOptions: {
        queries: {
            retry: false,
        },
    },
    logger: {
        log: console.log,
        warn: console.warn,
        // ✅ no more errors on the console
        error: () => { },
    }
});

function renderUserPage(user: User, curUser: SessionUser | undefined) {
    return (
        <QueryClientProvider client={testQueryClient}>
            <UserInfo user={user} currentUser={curUser} />
        </QueryClientProvider>
    )
}

jest.mock("next-auth/react");

afterEach(async () => {
    await testQueryClient.cancelQueries();
    testQueryClient.clear();
});

describe('Post render component', () => {
    it('should render when user visits its own profile', () => {

    });

    it('should render when other user visits the profile page', () => {

    });

});

