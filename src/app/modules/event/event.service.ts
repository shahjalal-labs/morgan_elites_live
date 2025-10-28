import { Event } from "@prisma/client";
import prisma from "../../../shared/prisma";

const createEvent = async (data: Event, userId: string) => {
  await prisma.event.create({
    data: {
      ...data,
      userId,
    },
  });
  return;
};

const getAllEvents = async () => {
  const results = await prisma.event.findMany();
  return results;
};

const getEventById = async (id: string) => {
  const result = await prisma.event.findUnique({ where: { id } });
  return result;
};

const updateEvent = async (id: string, data: any) => {
  await prisma.event.update({ where: { id }, data });
  return;
};

const deleteEvent = async (id: string) => {
  await prisma.event.delete({ where: { id } });
  return;
};

export const eventServices = {
  createEvent,
  getAllEvents,
  getEventById,
  updateEvent,
  deleteEvent,
};
