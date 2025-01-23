import { faker } from '@faker-js/faker';
import {
    book,
  genreEnum,
  notificationType,
  reservationStatusEnum,
  user,
  userRole,
} from '@prisma/client';
import { existsSync, mkdirSync, writeFileSync } from 'fs';
import prisma from './client';
import logger from '../utils/logger';
import path from 'path';
// doesn't do anything but allows me to use path and __dirname
import dotenv from 'dotenv'
dotenv.config()

const populateLogFile = 'populate' // log file I'm writing to

// where we are writing to
const populateDirectory = path.resolve(__dirname, './populate')
if (!existsSync(populateDirectory)){
  mkdirSync(populateDirectory)
}

const writeFileJSON = (filename: string) => {
  return path.join(populateDirectory, `${filename}.json`)
}



function generateISBN10(): string {
  const digits = Array.from({ length: 9 }, () => Math.floor(Math.random() * 10));
  const sum = digits.reduce((acc, digit, index) => acc + digit * (10 - index), 0);
  const checksum = 11 - (sum % 11);

  return digits.join('') + (checksum === 10 ? 'X' : checksum === 11 ? '0' : checksum);
}


type ExtendedPrismaService = typeof prisma

export type ExtendedPrismaServiceTransaction = Omit<
  ExtendedPrismaService,
  '$extends' | '$transaction' | '$disconnect' | '$connect' | '$on' | '$use'
>;

async function seedUsers(transaction: ExtendedPrismaServiceTransaction) {
  try {
    const users = Array.from({ length: 100 }, () => ({
      name: faker.person.fullName(),
      email: faker.internet.email(),
      password: faker.internet.password({ length: 10 }),
      phone_number: faker.phone.number({ style: 'international' }),
      role: faker.helpers.arrayElement([...Object.values(userRole).filter((role) => role != 'NONE')]),
    }));
  
    await transaction.user.createMany({ data: users, skipDuplicates: true});
    writeFileSync(writeFileJSON('users'), JSON.stringify(users, null, 2), 'utf-8');
    logger(populateLogFile).info('Users have been saved to users.json')
    return transaction.user.findMany();
  } catch (error) {
    logger(populateLogFile).error("An error occured while trying to populate the users table: ", error)
    return
  }
}

async function seedBooks(transaction: ExtendedPrismaServiceTransaction) {
  try {
    const books = Array.from({ length: 200 }, () => ({
      title: faker.lorem.sentence(3),
      author: faker.person.fullName(),
      genre: faker.helpers.arrayElement([...Object.values(genreEnum)]),
      publication_year: faker.date.past(),
      description: faker.lorem.paragraph(),
    }));
  
    await transaction.book.createMany({ data: books, skipDuplicates: true });
    writeFileSync(writeFileJSON('books'), JSON.stringify(books, null, 2), 'utf-8');
    logger(populateLogFile).info('Books have been saved to books.json');
    return transaction.book.findMany();
  } catch (error) {
    logger(populateLogFile).error("An error occured while trying to populate books table: ", error)
    return
  }
}

async function seedISBN(savedBooks: book[], transaction: ExtendedPrismaServiceTransaction) {
  try {
    const isbn = Array.from({ length: 5000 }, () => ({
      isbn: generateISBN10(),
      book_id: faker.helpers.arrayElement(savedBooks).id,
    }));
  
    await transaction.isbn.createMany({ data: isbn, skipDuplicates: true});
    writeFileSync(writeFileJSON('isbn'), JSON.stringify(isbn, null, 2), 'utf-8');
    logger(populateLogFile).info('ISBNs have been saved to isbn.json');
  } catch (error) {
    logger(populateLogFile).error("An error occured while trying to populate ISBN table: ", error)
  }
}

async function seedBorrowings(savedUsers: user[], savedBooks: book[], transaction: ExtendedPrismaServiceTransaction) {
  try {
    const borrowings = Array.from({ length: 1000 }, () => {
      const returnDate = faker.datatype.boolean() ? faker.date.recent() : null;
      return {
        user_id: faker.helpers.arrayElement(savedUsers).id,
        book_id: faker.helpers.arrayElement(savedBooks).id,
        borrow_date: faker.date.past(),
        due_date: faker.date.soon(),
        return_date: returnDate,
        returned: returnDate !== null,
        fine: faker.datatype.boolean()
          ? faker.number.float({ min: 1, max: 1000, fractionDigits: 2 })
          : null,
        paid: faker.datatype.boolean(),
      };
    });
  
    await transaction.borrowing.createMany({ data: borrowings, skipDuplicates: true });
    writeFileSync(writeFileJSON('borrowings'), JSON.stringify(borrowings, null, 2), 'utf-8');
    logger(populateLogFile).info('Borrowings have been saved to borrowings.json')
  } catch (error) {
    logger(populateLogFile).error("An error occured while trying to populate the Borrowings table: ", error)
  }
}

async function seedReservations(savedUsers: user[], savedBooks: book[], transaction: ExtendedPrismaServiceTransaction) {
  try {
    const reservations = Array.from({ length: 220 }, () => ({
      user_id: faker.helpers.arrayElement(savedUsers).id,
      book_id: faker.helpers.arrayElement(savedBooks).id,
      reservation_date: faker.date.past(),
      reservation_status: faker.helpers.arrayElement([...Object.values(reservationStatusEnum)]),
    }));
  
    await transaction.reservation.createMany({ data: reservations, skipDuplicates: true });
    writeFileSync(writeFileJSON('reservations'), JSON.stringify(reservations, null, 2), 'utf-8');
    logger(populateLogFile).info('Reservations have been saved to reservations.json');
  } catch (error) {
    logger(populateLogFile).error("An error occured while trying to populate the reservations table: ", error)
  }
}

async function seedCart(savedUsers: user[], savedBooks: book[], transaction: ExtendedPrismaServiceTransaction) {
  try {
    const cart = Array.from({ length: 250 }, () => ({
      user_id: faker.helpers.arrayElement(savedUsers).id,
      book_id: faker.helpers.arrayElement(savedBooks).id,
      added_date: faker.date.past(),
    }));
  
    await transaction.cart.createMany({ data: cart, skipDuplicates: true });
    writeFileSync(writeFileJSON('cart'), JSON.stringify(cart, null, 2), 'utf-8');
    logger(populateLogFile).info('Cart items have been saved to cart.json');
  } catch (error) {
    logger(populateLogFile).error("An error occured while trying to populate the cart table: ", error)
  }
}

async function seedNotifications(savedUsers: user[], transaction: ExtendedPrismaServiceTransaction) {
  try {
    const notifications = Array.from({ length: 1000 }, () => ({
      user_id: faker.helpers.arrayElement(savedUsers).id,
      type: faker.helpers.arrayElement([...Object.values(notificationType)]),
      content: faker.lorem.paragraph(),
      is_read: faker.datatype.boolean(),
    }));
  
    await transaction.notification.createMany({ data: notifications, skipDuplicates: true });
    writeFileSync(writeFileJSON('notifications'), JSON.stringify(notifications, null, 2), 'utf-8');
    logger(populateLogFile).info('Notifications have been saved to notifications.json');
  } catch (error) {
    logger(populateLogFile).error("An error occured while trying to populate the notifications table: ", error)
  }
}

async function seedReadHistory(savedUsers: user[], savedBooks: book[], transaction: ExtendedPrismaServiceTransaction) {
  try {
    const readHistory = Array.from({ length: 5000 }, () => ({
      user_id: faker.helpers.arrayElement(savedUsers).id,
      book_id: faker.helpers.arrayElement(savedBooks).id,
      finished: faker.datatype.boolean(),
      rating: faker.number.int({ min: 1, max: 5 }),
      review: faker.lorem.sentence({ min: 7, max: 20 }),
    }));
  
    await transaction.readHistory.createMany({ data: readHistory, skipDuplicates: true });
    writeFileSync(writeFileJSON('readHistory'), JSON.stringify(readHistory, null, 2), 'utf-8');
    logger(populateLogFile).info('Read history has been saved to readHistory.json');
  } catch (error) {
    logger(populateLogFile).error("An error occured while trying to populate the read history table: ", error)
  }
}

async function updateBookDependencies(transaction: ExtendedPrismaServiceTransaction) {
try {
      const availablecopies = await transaction.isbn.groupBy({
          by: ['book_id'],
          _count: true
        })
      
      const avg_rating = await transaction.readHistory.groupBy({
          by: ['book_id'],
          _avg: {
              rating: true
          }
        })
      
      
      await Promise.all(
          availablecopies.map(async (book) => {
              const matchingRating = avg_rating.find((rating) => rating.book_id === book.book_id)
              await transaction.book.update({
                  where: {
                      id: book.book_id
                  },
                  data: {
                      available_copies: book._count,
                      avg_rating: matchingRating?._avg?.rating || 0
                  }
              })
          })
      )
        
    logger(populateLogFile).info("Updated book Dependencies");
} catch (error) {
    logger(populateLogFile).error("An error occured while trying to update the book dependencies: ", error)
}
}




async function populate() {
  try {
    console.log('Seeding database...');

    await prisma.$transaction(
      async (transaction) => {

      const savedUsers = await seedUsers(transaction);
      const savedBooks = await seedBooks(transaction);
    
      if (savedUsers && savedBooks) {
        await Promise.all([
          seedISBN(savedBooks, transaction),
          seedBorrowings(savedUsers, savedBooks, transaction),
          seedReservations(savedUsers, savedBooks, transaction),
          seedCart(savedUsers, savedBooks, transaction),
          seedNotifications(savedUsers, transaction),
          seedReadHistory(savedUsers, savedBooks, transaction),
        ]);
      }
    
      await updateBookDependencies(transaction)
    },
    {
      timeout: 15000
    }
    )
  
    console.log('Seeding completed!');
  } catch (error) {
    console.error("Error in seeding the database: ", error)
  }
}

populate();
