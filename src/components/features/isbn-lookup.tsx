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

type BarcodeDetectorCtor = new (options: { formats: string[] }) => BarcodeDetectorLike;

declare global {
  interface Window {
    BarcodeDetector?: BarcodeDetectorCtor & {
      getSupportedFormats: () => Promise<string[]>;
    };
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
    // BarcodeDetector自体はあってもEAN-13に対応しているとは限らない端末があるため、
    // 対応フォーマットを実際に確認してからボタンを表示する。
    const ctor = typeof window !== "undefined" ? window.BarcodeDetector : undefined;
    if (!ctor) {
      setCameraSupported(false);
      return;
    }
    ctor
      .getSupportedFormats()
      .then((formats) => setCameraSupported(formats.includes("ean_13")))
      .catch(() => setCameraSupported(false));
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
    if (!BarcodeDetectorCtor || !navigator.mediaDevices?.getUserMedia) {
      toast.error("お使いのブラウザはカメラでの読み取りに対応していません");
      return;
    }

    try {
      let stream: MediaStream;
      try {
        // 背面カメラを希望値として要求する。exact指定にすると、背面カメラを
        // 複数搭載した一部のAndroid端末で列挙に失敗し起動できないことがあるため、
        // ideal指定に留める。
        stream = await navigator.mediaDevices.getUserMedia({
          video: { facingMode: { ideal: "environment" } },
        });
      } catch {
        // facingMode指定自体が原因で失敗する端末向けに、指定なしで再試行する。
        stream = await navigator.mediaDevices.getUserMedia({ video: true });
      }
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
    } catch (error) {
      if (error instanceof DOMException && error.name === "NotAllowedError") {
        toast.error("カメラの使用が許可されませんでした。ブラウザの設定を確認してください");
      } else if (error instanceof DOMException && error.name === "NotFoundError") {
        toast.error("カメラが見つかりませんでした");
      } else {
        toast.error("カメラを起動できませんでした");
      }
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
