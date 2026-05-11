-- CreateTable
CREATE TABLE "Video" (
    "id" SERIAL NOT NULL,
    "uri" TEXT NOT NULL,
    "name" TEXT,

    CONSTRAINT "Video_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Video_uri_key" ON "Video"("uri");
