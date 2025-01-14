import { PureAbility, AbilityBuilder } from '@casl/ability';
import { createPrismaAbility, PrismaQuery, Subjects } from '@casl/prisma';
import {book, borrowing, cart, finePayment, isbn, notification, readHistory, reservation, user, userRole} from '@prisma/client'

export type Actions = 'create' | 'read' | 'update' | 'delete';


export type AppAbility = PureAbility<[Actions, Subjects<{
    // they must match unless ou want to be battling with unnecessary error 
    book: book,
    borrowing: borrowing,
    cart: cart,
    finePayment: finePayment,
    isbn: isbn,
    notification: notification,
    readHistory: readHistory,
    reservation: reservation,
    user: user,
}>], PrismaQuery>;


const userRoleArray: userRole[] = [userRole.USER, userRole.LIBRARIAN, userRole.ADMIN]

const librarianRoleArray: userRole[] = [userRole.ADMIN, userRole.LIBRARIAN]

export const defineAbilitiesForUser = (user: user) => {
    const {can , build} = new AbilityBuilder<AppAbility>(createPrismaAbility)

    can('create', 'user')

    // permissions for user
    if (userRoleArray.includes(user.role)) {
        can('read', 'book')
        can('create', 'borrowing')
        can('read', 'borrowing', {user_id: user.id}) // user can only read their own borrow record
        can('create', 'cart')
        can('read', 'cart', {user_id: user.id})
        can('delete','cart', {user_id: user.id})
        can('create', 'finePayment')
        can('read', 'finePayment', {borrowing_user_id: user.id})
        can('read', 'isbn')
        can('create', 'notification')
        can('read', 'notification', {user_id: user.id})
        can('update', 'notification', ['is_read'], {user_id: user.id})
        can('create', 'readHistory')
        can('read', 'readHistory', {user_id: user.id})
        can('update', 'readHistory', ['finished', 'rating', 'review'], {user_id: user.id})
        can('create', 'reservation')
        can('read', 'reservation', {user_id: user.id})
        can('update', 'reservation', ['reservation_status'], {user_id: user.id})
        can('delete', 'reservation', {user_id: user.id})
        can('read', 'user', {id: user.id})
        can('update', 'user', ['email', 'name', 'password', 'phone_number', 'refreshToken'], {id: user.id})
        can('delete', 'user', {id: user.id})
    }


    // permissions for librarian
    if (librarianRoleArray.includes(user.role)) {
        can('create', 'book')
        can('update', 'book')
        can('delete', 'book')
        can('read', 'borrowing')
        can('update', 'borrowing', ['due_date', 'return_date', 'returned'])
        can('read', 'finePayment')
        can('create', 'isbn')
        can('update', 'isbn')
        can('delete', 'isbn')
        can('read', 'reservation')
    }

    // permissions for admin
    if (user.role === 'ADMIN') {
        can('delete', 'borrowing')
        can('update', 'finePayment')
        can('delete', 'finePayment')
        can('read', 'user')
        can('update', 'user')
        can('delete', 'user')
    }

    return build()

}

