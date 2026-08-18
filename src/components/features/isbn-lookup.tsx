"use client";

import { useEffect, useRef, useState, useTransition } from "react";
import { Camera, Search, X } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { lookupIsbnAction } from "@/server/actions/isbn";

type BarcodeDetectorLike = {
  detect: (source: HTMLVideoElement) => Promise<{ rawValue: string }[]>;
};

declare global {
  interface Window {
    BarcodeDetector?: new (options: { formats: string[] }) => BarcodeDetectorLike;
  }
}

export function IsbnLookup({
  onResult,
}: {
  onResult: (data: { title: string; author: string | null }) => void;
}) {
  const [isbn, setIsbn] = useState("");
  const [isPending, startTransition] = useTransition();
  const [isScanning, setIsScanning] = useState(false);
  const [cameraSupported, setCameraSupported] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);
  const streamRef = useRef<MediaStream | null>(null);

  useEffect(() => {
    setCameraSupported(typeof window !== "undefined" && "BarcodeDetector" in window);
  }, []);

  useEffect(() => {
    return () => {
      streamRef.current?.getTracks().forEach((track) => track.stop());
    };
  }, []);

  const runLookup = (value: string) => {
    startTransition(async () => {
      const result = await lookupIsbnAction(value);
      if (result.error || !result.data) {
        toast.error(result.error ?? "書籍情報が見つかりませんでした");
        return;
      }
      onResult(result.data);
      toast.success("書籍情報を取得しました");
    });
  };

  const stopScan = () => {
    streamRef.current?.getTracks().forEach((track) => track.stop());
    streamRef.current = null;
    setIsScanning(false);
  };

  const startScan = async () => {
    const BarcodeDetectorCtor = window.BarcodeDetector;
    if (!BarcodeDetectorCtor) return;

    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: "environment" },
      });
      streamRef.current = stream;
      setIsScanning(true);
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        await videoRef.current.play();
      }

      const detector = new BarcodeDetectorCtor({ formats: ["ean_13"] });

      const tick = async () => {
        if (!streamRef.current || !videoRef.current) return;
        try {
          const barcodes = await detector.detect(videoRef.current);
          if (barcodes.length > 0) {
            const value = barcodes[0].rawValue;
            setIsbn(value);
            stopScan();
            runLookup(value);
            return;
          }
        } catch {
          // 1フレーム分の読み取り失敗は無視して次のフレームで再試行する
        }
        if (streamRef.current) requestAnimationFrame(tick);
      };
      requestAnimationFrame(tick);
    } catch {
      toast.error("カメラを起動できませんでした");
      setIsScanning(false);
    }
  };

  return (
    <div className="flex flex-col gap-2 rounded-md border p-3">
      <Label htmlFor="isbn-input">ISBNから書籍情報を取得（任意）</Label>
      <div className="flex flex-wrap items-center gap-2">
        <Input
          id="isbn-input"
          placeholder="978XXXXXXXXXX"
          value={isbn}
          onChange={(e) => setIsbn(e.target.value)}
          className="max-w-48"
        />
        <Button
          type="button"
          variant="outline"
          size="sm"
          disabled={isPending || !isbn}
          onClick={() => runLookup(isbn)}
        >
          <Search /> 検索
        </Button>
        {cameraSupported && !isScanning && (
          <Button type="button" variant="outline" size="sm" onClick={startScan}>
            <Camera /> カメラで読み取る
          </Button>
        )}
        {isScanning && (
          <Button type="button" variant="outline" size="sm" onClick={stopScan}>
            <X /> 中止
          </Button>
        )}
      </div>
      {isScanning && (
        <video
          ref={videoRef}
          className="w-full max-w-xs rounded-md"
          muted
          playsInline
        />
      )}
    </div>
  );
}
