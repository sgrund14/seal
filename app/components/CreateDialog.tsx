"use client";

import { FC, useRef, useState } from "react";
import { kv } from "@vercel/kv";
import { Dialog, DialogContent, DialogTitle, DialogTrigger } from "./Dialog";
import { Button } from "./Button";
import { Input } from "./Input";
import { Loader } from "lucide-react";
import { toast } from "sonner";
import { Textarea } from "./Textarea";
import { PutBlobResult } from "@vercel/blob";
import { upload } from "@vercel/blob/client";

type Props = {
  onSuccess: () => void;
};

export const CreateDialog: FC<Props> = ({ onSuccess }) => {
  const [contestTitle, setContestTitle] = useState("");
  const [contestDescription, setContestDescription] = useState("");
  const [endDate, setEndDate] = useState("");
  const [prizeAmount, setPrizeAmount] = useState("");
  const [options, setOptions] = useState(["", "", "", ""]);
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleOptionChange = (index: number, value: string) => {
    const newOptions = [...options];
    newOptions[index] = value;
    setOptions(newOptions);
  };

  const [blob, setBlob] = useState<PutBlobResult | null>(null);

  const handleImageUpload = async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = event.target.files?.[0];
    if (file) {
      try {
        const response = await upload(file.name, file, {
          access: "public",
          handleUploadUrl: "/api/upload",
        });
        setBlob(response);
      } catch (error) {
        console.error("Error uploading image:", error);
        // Handle error (e.g., show error message to user)
      }
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    // Handle form submission
    // Save to KV
    const contest = {
      id: crypto.randomUUID(),
      title: contestTitle,
      description: contestDescription,
      endDate,
      prizeAmount,
      options,
      image: blob?.url,
    };
    await kv.set(`contest:${contest.id}`, contest);
    await kv.lpush("contests", contest.id);
    onSuccess();
    setIsOpen(false);
    setIsLoading(false);
    toast.success("Contest created successfully");
  };

  const disabled =
    !contestTitle ||
    !endDate ||
    !prizeAmount ||
    options.every((option) => option === "");

  // then, when done, return next frame
  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button>Create New Contest</Button>
      </DialogTrigger>
      <DialogContent className="max-h-[90vh] overflow-y-auto">
        <DialogTitle>New Contest</DialogTitle>
        <form
          className="space-y-4 flex flex-col gap-2 items-center"
          onSubmit={handleSubmit}
        >
          <div className="w-full grid gap-2">
            <label
              htmlFor="contestTitle"
              className="block text-sm font-medium text-gray-700"
            >
              Contest Title*
            </label>
            <Input
              type="text"
              id="contestTitle"
              name="contestTitle"
              value={contestTitle}
              onChange={(e) => setContestTitle(e.target.value)}
              placeholder="Enter contest title..."
            />
          </div>

          <div className="w-full grid gap-2">
            <label
              htmlFor="description"
              className="block text-sm font-medium text-gray-700"
            >
              Description
            </label>
            <Textarea
              id="description"
              name="description"
              value={contestDescription}
              onChange={(e) => setContestDescription(e.target.value)}
              rows={3}
              placeholder="Enter contest description..."
            />
          </div>

          <div className="w-full grid gap-2">
            <label
              htmlFor="contestImage"
              className="block text-sm font-medium text-gray-700"
            >
              Contest Image
            </label>
            <Input
              type="file"
              id="contestImage"
              name="contestImage"
              accept="image/*"
              onChange={handleImageUpload}
            />
            {blob && (
              <div className="max-w-[200px] max-h-[200px]">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={blob.url}
                  alt="Contest preview"
                  className="h-full w-full object-cover"
                />
              </div>
            )}
          </div>

          <div className="w-full grid gap-2">
            <label
              htmlFor="endDate"
              className="block text-sm font-medium text-gray-700"
            >
              End Date*
            </label>
            <Input
              type="date"
              id="endDate"
              name="endDate"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
            />
          </div>

          <div className="w-full grid gap-2">
            <label
              htmlFor="prizeAmount"
              className="block text-sm font-medium text-gray-700"
            >
              Prize Amount*
            </label>
            <Input
              type="number"
              id="prizeAmount"
              name="prizeAmount"
              min="0"
              step="0.01"
              value={prizeAmount}
              placeholder="Enter prize amount in USD..."
              onChange={(e) => setPrizeAmount(e.target.value)}
            />
          </div>

          <div className="grid gap-2 w-full">
            <label className="block text-sm font-medium text-gray-700">
              Contest Options (up to 4)*
            </label>
            {options.map((option, index) => (
              <Input
                key={index}
                type="text"
                id={`option${index + 1}`}
                name={`option${index + 1}`}
                placeholder={`Option ${index + 1}`}
                value={option}
                onChange={(e) => handleOptionChange(index, e.target.value)}
              />
            ))}
          </div>

          <Button
            type="submit"
            className="min-w-[146px] min-h-[56px]"
            disabled={disabled}
          >
            {isLoading ? <Loader className="w-5 h-5 animate-spin" /> : "Create"}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
};
