"use server";

import { auth } from "@clerk/nextjs/server";
import { InputType } from "./types";
import { db } from "@/lib/db";
import { revalidatePath } from "next/cache";
import { createSafeAction } from "@/lib/create-safe-action";
import { CreateBoard } from "./schema";

const handler = async (data: InputType): Promise<ReturnType<any>> => {
  const { userId } = auth();

  if (!userId) {
    return { error: "User not authenticated" };
  }

  const { title } = data;

  let board;

  try {
    board = await db.board.create({
      data: {
        title,
      },
    });
  } catch (error) {
    return { error: "Failed to create the board" };
  }

  revalidatePath(`/board/${board.id}`);
  return { data: board };
};

export const createBoard = createSafeAction(CreateBoard, handler);