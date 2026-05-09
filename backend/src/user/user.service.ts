/* eslint-disable @typescript-eslint/no-unsafe-return */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */

import { Injectable, HttpStatus } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { Prisma, User } from '@prisma/client';

import { PrismaService } from '@/prisma/prisma.service';
import { Role } from '@/common/enums/role.enum';
import { ErrorCodes } from '@/common/errors/error-codes';
import { BaseException } from '@/common/exceptions/base.exception';

import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { QueryUserDto } from './dto/query-user.dto';

@Injectable()
export class UserService {
  private readonly SALT_ROUNDS = 10;

  constructor(private readonly prisma: PrismaService) {}

  // =========================
  // CREATE USER
  // =========================
  async create(dto: CreateUserDto): Promise<User> {
    const existingUser = await this.prisma.user.findUnique({
      where: { email: dto.email },
    });

    if (existingUser) {
      throw new BaseException(
        ErrorCodes.AUTH_USER_EXISTS,
        HttpStatus.CONFLICT,
      );
    }

    const hashedPassword = await this.hashPassword(dto.password);

    try {
      return await this.prisma.user.create({
        data: {
          ...dto,
          password: hashedPassword,
          role: dto.role ?? Role.USER,
        },
      });
    } catch (err) {
      this.handlePrismaError(err);
    }
  }

  // =========================
  // FIND ALL USERS
  // =========================
  async findAll(query: QueryUserDto) {
    const take = query.limit ?? 10;
    const page = query.page ?? 1;
    const skip = (page - 1) * take;

    const where: Prisma.UserWhereInput = {
      ...(query.name && {
        name: {
          contains: query.name,
          mode: 'insensitive',
        },
      }),
      ...(query.email && {
        email: {
          contains: query.email,
          mode: 'insensitive',
        },
      }),
      ...(query.role && { role: query.role }),
    };

    const [data, total] = await this.prisma.$transaction([
      this.prisma.user.findMany({
        where,
        take,
        skip,
        orderBy: {
          createdAt: query.sortByCreatedAt ?? 'desc',
        },
      }),
      this.prisma.user.count({ where }),
    ]);

    return {
      data,
      meta: {
        total,
        page,
        limit: take,
        totalPages: Math.ceil(total / take),
      },
    };
  }

  // =========================
  // FIND ONE
  // =========================
  async findOne(id: string): Promise<User> {
    const user = await this.prisma.user.findUnique({
      where: { id },
    });

    if (!user) {
      throw new BaseException(
        ErrorCodes.USER_NOT_FOUND,
        HttpStatus.NOT_FOUND,
      );
    }

    return user;
  }

  // =========================
  // UPDATE USER
  // =========================
  async update(id: string, dto: UpdateUserDto): Promise<User> {
    await this.ensureUserExists(id);

    if (dto.password) {
      dto.password = await this.hashPassword(dto.password);
    }

    try {
      return await this.prisma.user.update({
        where: { id },
        data: dto,
      });
    } catch (err) {
      this.handlePrismaError(err);
    }
  }

  // =========================
  // SOFT TOGGLE ACTIVE
  // =========================
  async remove(id: string): Promise<User> {
    const user = await this.findOne(id);

    return this.prisma.user.update({
      where: { id },
      data: {
        active: !user.active,
      },
    });
  }

  // =========================
  // ME
  // =========================
  async getMe(id: string) {
    return this.findOne(id);
  }

  // =========================
  // HELPERS
  // =========================
  private async hashPassword(password: string): Promise<string> {
    return bcrypt.hash(password, this.SALT_ROUNDS);
  }

  private async ensureUserExists(id: string) {
    const exists = await this.prisma.user.findUnique({
      where: { id },
    });

    if (!exists) {
      throw new BaseException(
        ErrorCodes.USER_NOT_FOUND,
        HttpStatus.NOT_FOUND,
      );
    }
  }

  // =========================
  // PRISMA ERROR HANDLER
  // =========================
  private handlePrismaError(err: any): never {
    if (err instanceof Prisma.PrismaClientKnownRequestError) {
      switch (err.code) {
        case 'P2002':
          throw new BaseException(
            ErrorCodes.DB_DUPLICATE,
            HttpStatus.CONFLICT,
          );

        case 'P2025':
          throw new BaseException(
            ErrorCodes.USER_NOT_FOUND,
            HttpStatus.NOT_FOUND,
          );

        default:
          throw new BaseException(
            ErrorCodes.INTERNAL_ERROR,
            HttpStatus.INTERNAL_SERVER_ERROR,
          );
      }
    }

    throw new BaseException(
      ErrorCodes.INTERNAL_ERROR,
      HttpStatus.INTERNAL_SERVER_ERROR,
    );
  }
}