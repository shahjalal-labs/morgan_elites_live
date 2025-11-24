import { Polls } from "@prisma/client";
import prisma from "../../../shared/prisma";
import ApiError from "../../../errors/ApiErrors";

const createPolls = async (data: Polls, userId: string, streamId: string) => {
  await prisma.polls.create({
    data: {
      ...data,
      userId,
      streamId,
    },
  });
  return;
};

const getAllPollss = async () => {
  const results = await prisma.polls.findMany();
  return results;
};

const getPollsById = async (streamId: string, userId: string) => {
  const result = await prisma.polls.findUnique({
    where: { streamId },
    select: {
      id: true,
      userId: true,
      question: true,
      options: true,
    },
  });
  if (!result) throw new ApiError(404, "Polls not found");

  return {
    ...result,
    isOwner: result.userId === userId ? true : false,
  };
};

const updatePolls = async (
  id: string,
  data: {
    options: string[];
  }
) => {
  const pollsInfo = await prisma.polls.findUnique({ where: { id } });
  if (!pollsInfo) throw new ApiError(404, "Polls not found");

  const duplicates = data.options.filter((option) =>
    pollsInfo.options.includes(option)
  );

  if (duplicates.length > 0) {
    throw new ApiError(
      409,
      `Options already included: ${duplicates.join(", ")}`
    );
  }

  await prisma.polls.update({
    where: { id },
    data: {
      ...data,
      options: {
        push: data.options,
      },
    },
  });
  return;
};

const submitVote = async (pollsId: string, userId: string, option: string) => {
  const pollsInfo = await prisma.polls.findUnique({ where: { id: pollsId } });
  if (!pollsInfo) throw new ApiError(404, "Polls not found");
  if (!pollsInfo.options.includes(option))
    throw new ApiError(400, "Invalid option selection");

  const userInfo = await prisma.user.findUnique({ where: { id: userId } });
  if (!userInfo) throw new ApiError(404, "User not found");

  await prisma.submitVote.upsert({
    where: {
      userId_pollsId: { userId, pollsId },
    },
    update: {
      option,
    },
    create: {
      pollsId,
      userId,
      option,
    },
  });
  return;
};

const pollsResult = async (streamId: string, userId: string) => {
  const result = await prisma.polls.findUnique({
    where: { streamId },
    select: {
      id: true,
      userId: true,
      question: true,
      options: true,
    },
  });

  if (!result) throw new ApiError(404, "Poll not found");

  // Fetch all votes with user info
  const votes = await prisma.submitVote.findMany({
    where: { pollsId: result.id },
    include: {
      user: {
        select: {
          id: true,
          profileImage: true,
        },
      },
    },
  });

  const totalVotes = votes.length;

  // Build option result with count + voters + percentage
  const optionResults = result.options.map((option) => {
    const optionVotes = votes.filter((v) => v.option === option);

    const count = optionVotes.length;
    const percentage =
      totalVotes === 0
        ? 0
        : parseFloat(((count / totalVotes) * 100).toFixed(2));

    return {
      option,
      count,
      percentage,
      voters: optionVotes.map((v) => v.user),
    };
  });

  return {
    id: result.id,
    question: result.question,
    options: optionResults,
    isOwner: result.userId === userId,
  };
};

const deletePolls = async (id: string) => {
  const pollsInfo = await prisma.polls.findUnique({ where: { id } });
  if (!pollsInfo) throw new ApiError(404, "Polls not found");

  await prisma.polls.delete({ where: { id } });
  return;
};

export const pollsServices = {
  createPolls,
  getAllPollss,
  getPollsById,
  submitVote,
  pollsResult,
  updatePolls,
  deletePolls,
};
