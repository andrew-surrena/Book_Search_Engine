import { User } from '../models/index.js';
import { signToken } from '../utils/auth.js';
import { AuthenticationError } from '../utils/auth.js';

// Define types for the arguments
interface AddUserArgs {
    input: {
        username: string;
        email: string;
        password: string;
    }
}

interface LoginUserArgs {
    email: string;
    password: string;
}

// interface BookArgs {
// bookId: string;
// title: string;
// authors: [string];
// description: string;
// image: string;
// link: string;
// }

interface AddBookArgs {
    input: {
        author: [string];
        bookId: string;
        title: string;
        description: string;
        image: string;
        link: string;
    }
}

interface DeleteBookArgs {
    bookId: string;
}

const resolvers = {
    Query: {
        // Query to get the authenticated user's information
        // The 'me' query relies on the context to check if the user is authenticated
        me: async (_parent: any, _args: any, context: any) => {
            // If the user is authenticated, find and return the user's information along with their thoughts
            if (context.user) {
                return User.findOne({ _id: context.user._id }).populate('savedBooks');
            }
            // If the user is not authenticated, throw an AuthenticationError
            throw new AuthenticationError('Could not authenticate user.');
        },
    },
    Mutation: {
        addUser: async (_parent: any, { input }: AddUserArgs) => {
            // Create a new user with the provided username, email, and password
            const user = await User.create({ ...input });

            // Sign a token with the user's information
            const token = signToken(user.username, user.email, user._id);

            // Return the token and the user
            return { token, user };
        },

        login: async (_parent: any, { email, password }: LoginUserArgs) => {
            // Find a user with the provided email
            const user = await User.findOne({ email });

            // If no user is found, throw an AuthenticationError
            if (!user) {
                throw new AuthenticationError('Could not authenticate user.');
            }

            // Check if the provided password is correct
            const correctPw = await user.isCorrectPassword(password);

            // If the password is incorrect, throw an AuthenticationError
            if (!correctPw) {
                throw new AuthenticationError('Could not authenticate user.');
            }

            // Sign a token with the user's information
            const token = signToken(user.username, user.email, user._id);

            // Return the token and the user
            return { token, user };
        },
        addBook: async (_parent: any, { input }: AddBookArgs, context: any) => {
            if (context.user) {
                // const book = await Book.create({ ...input });

                const updatedUser = await User.findOneAndUpdate(
                    { _id: context.user._id },
                    { $addToSet: { savedBooks: input } }
                );

                return updatedUser;
            }
            throw AuthenticationError;
            ('You need to be logged in!');
        },
        deleteBook: async (_parent: any, { bookId }: DeleteBookArgs, context: any) => {
            if (context.user) {
                // const book = await Book.findOneAndDelete({
                //     bookId: bookId,
                // });

                // if(!book){
                //   throw AuthenticationError;
                // }
                const updatedUser =
                    await User.findOneAndUpdate(
                        { _id: context.user._id },
                        { $pull: { savedBooks: bookId } }
                    );
                if (!updatedUser) {
                    return "Couldn't find user with this id!"
                }
                return updatedUser;
            }
            throw AuthenticationError;
        },
    },
};

export default resolvers;
